using System;
using System.Collections.Generic;
using System.Data;
using Microsoft.Data.SqlClient;
using Newtonsoft.Json.Linq;

namespace CMSMailbox
{
    // Central database access point, ported from CMS\DBF.cs so both apps write to the
    // same insertAction audit trail. Every SQL call in this app should go through
    // GetDB rather than opening a SqlConnection directly.
    public static class DB
    {
        public static string ConnectionString;
        public static string Url;
        public static string Environment;
        public static string JWT_Key;
        public static string GmfaKey; // must match the corresponding CMS environment's value exactly

        public static DataTable GetDB(string sql, int UID, string strParams = "", bool errPass = false, string cs = "", string timeout = "10")
        {
            DataTable Dat = new DataTable();
            DataTable action_dat = new DataTable();

            string errmsg = "";
            List<string> listParams = new List<string>();

            try
            {
                cs = (cs == "") ? ConnectionString : cs;
                cs = cs.Replace("Timeout=10", "Timeout=" + timeout);

                var da = new SqlDataAdapter(sql, cs);
                da.SelectCommand.CommandTimeout = 180;

                da.SelectCommand.Parameters.AddWithValue("@UID", UID);

                if (strParams != "")
                {
                    var jsonParams = JObject.Parse(strParams);
                    foreach (var key in jsonParams)
                    {
                        listParams.Add(key.Key);
                        da.SelectCommand.Parameters.AddWithValue("@" + key.Key, key.Value.ToString());
                    }
                }

                da.Fill(Dat);
            }
            catch (Exception err)
            {
                errmsg = err.ToString();

                if (!errPass && errmsg.IndexOf("There is already an object named") > -1)
                {
                    return GetDB(sql, UID, strParams, true);
                }
            }

            if (errmsg != "")
            {
                Dat = new DataTable();
                Dat.Columns.Add("err");
                DataRow workRow = Dat.NewRow();
                workRow["err"] = errmsg;
                Dat.Rows.Add(workRow);
            }

            LogAction(sql, UID, listParams, errmsg);

            return Dat;
        }

        // Same parameter/audit contract as GetDB, but for procs that return more than
        // one result set (e.g. MBX_GetMessage: header row set + item row set).
        public static DataSet GetDBSet(string sql, int UID, string strParams = "")
        {
            DataSet ds = new DataSet();
            string errmsg = "";
            List<string> listParams = new List<string>();

            try
            {
                var da = new SqlDataAdapter(sql, ConnectionString);
                da.SelectCommand.CommandTimeout = 180;
                da.SelectCommand.Parameters.AddWithValue("@UID", UID);

                if (strParams != "")
                {
                    var jsonParams = JObject.Parse(strParams);
                    foreach (var key in jsonParams)
                    {
                        listParams.Add(key.Key);
                        da.SelectCommand.Parameters.AddWithValue("@" + key.Key, key.Value.ToString());
                    }
                }

                da.Fill(ds);
            }
            catch (Exception err)
            {
                // Caller treats an empty/short DataSet as "not found / not authorized" —
                // see ItemController and InboxController.GetMessage for the fail-closed
                // handling this relies on.
                errmsg = err.ToString();
            }

            LogAction(sql, UID, listParams, errmsg);

            return ds;
        }

        private static void LogAction(string sql, int UID, List<string> paramNames, string errmsg)
        {
            try
            {
                var title = sql.Split("@")[0].Trim().Replace("exec ", "");
                var exclusions = "MBX_GetInbox";

                if (exclusions.IndexOf(title) == -1)
                {
                    var action_da = new SqlDataAdapter("exec insertAction @uid, @title, @sp, @params, @results", ConnectionString);
                    action_da.SelectCommand.Parameters.AddWithValue("@UID", UID);
                    action_da.SelectCommand.Parameters.AddWithValue("@title", title);
                    action_da.SelectCommand.Parameters.AddWithValue("@sp", sql.Split("@")[0].Trim());
                    action_da.SelectCommand.Parameters.AddWithValue("@params", String.Join(",", paramNames));
                    action_da.SelectCommand.Parameters.AddWithValue("@results", errmsg == "" ? "done" : "error");
                    var action_dat = new DataTable();
                    action_da.Fill(action_dat);
                }
            }
            catch
            {
                // audit insert is best-effort, same as CMS's DBF.cs
            }
        }
    }
}
