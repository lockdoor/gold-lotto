import React from "react";
import Layout from "@/components/layout";
import FormAddTable from "@/components/formAddTable";
import Tables from "@/components/tables";

export default function TablesIndex() {
  return (
    <Layout page={"tables"}>
      <main>
        <FormAddTable />
        <Tables />
      </main>
    </Layout>
  );
}
