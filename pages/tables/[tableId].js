import React, { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "react-query";
import { getTable, putSettingTable, deleteSettingTable } from "@/clientRequest/tables";
import Layout from "@/components/layout";
import { formatDate } from "@/lib/helper";
import TableNumber from "@/components/tableNumber";
import TableCustomer from "@/components/tableCustomer";
import Drawer from "react-modern-drawer";
import Modal from "@/components/modal";
import EmojiPicker from "emoji-picker-react";
import "react-modern-drawer/dist/index.css";
import { useRouter } from "next/router";

export default function Table({ tableId }) {
  const rounter = useRouter()
  const [drawerState, setDrawerState] = useState(false);
  const [showModalSettingTableName, setShowModalSettingTableName] =
    useState(false);
  const [showModalSettingTableDetail, setShowModalSettingTableDetail] =
    useState(false);
  const [showModalSettingTablePrice, setShowModalSettingTablePrice] =
    useState(false);
  const [showModalSettingTableDate, setShowModalSettingTableDate] =
    useState(false);
  const [showModalSettingTableEmoji, setShowModalSettingTableEmoji] =
    useState(false);
  const queryClient = useQueryClient();
  const putSettingTableMutation = useMutation(putSettingTable, {
    onSuccess: (response) => {
      queryClient.prefetchQuery(["getTable", tableId], getTable);
      setShowModalSettingTableName(false);
      setShowModalSettingTableDetail(false);
      setShowModalSettingTablePrice(false);
      setShowModalSettingTableDate(false);
      setShowModalSettingTableEmoji(false);
    },
  });
  const deleteSettingTableMutation = useMutation(deleteSettingTable, {
    onSuccess: (response) => {
      rounter.replace('/tables')
    },
  });
  const { isLoading, isError, data, error } = useQuery(
    ["getTable", tableId],
    getTable
  );
  const onClickSettingTableName = () => {
    setDrawerState(false);
    setShowModalSettingTableName(true);
  };
  const onClickSettingTableDetail = () => {
    setDrawerState(false);
    setShowModalSettingTableDetail(true);
  };
  const onClickSettingTablePrice = () => {
    setDrawerState(false);
    setShowModalSettingTablePrice(true);
  };
  const onClickSettingTableDate = () => {
    setDrawerState(false);
    setShowModalSettingTableDate(true);
  };
  const onClickSettingTableEmoji = () => {
    setDrawerState(false);
    setShowModalSettingTableEmoji(true);
  };
  const onClickSettingTableIsOpen = () => {
    const payload = {
      tableIsOpen: !data.tableIsOpen,
      tableId: data._id
    }
    putSettingTableMutation.mutate(payload)
  };
  const onClickSettingTableDelete = () => {
    if(data.tableIsOpen) return
    deleteSettingTableMutation.mutate({tableId})
  }
  const onClickSubmitSetting = (obj) => {
    const key = Object.keys(obj)[0];
    console.log(key);
    if (data[key] == obj[key]) {
      console.log("ไม่มีการเปลี่ยนแปลง");
      return;
    } else {
      console.log(obj);
      obj.tableId = data._id;
      putSettingTableMutation.mutate(obj);
    }
  };
  if (isLoading) return <div>Table is Loading</div>;
  if (isError) return <div>Table Got Error {error}</div>;
  // console.log(data)
  return (
    <Layout page={"tables"}>
      <div class="flex justify-center"></div>
      <main className="mt-5">
        <div
          className="text-center text-2xl cursor-pointer"
          onClick={() => setDrawerState(true)}
        >
          {data.tableName}
        </div>
        <div className="text-center">{data.tableDetail}</div>
        <div className="text-center">{data.tablePrice}</div>
        <div className="text-center">{formatDate(data.tableDate)}</div>
        <TableNumber data={data} />
        <TableCustomer data={data} />
      </main>
      <Drawer
        open={drawerState}
        onClose={() => setDrawerState(false)}
        direction="left"
        customIdSuffix
      >
        <div className="m-3">
          <div className="text-2xl bg-pink-300 p-2 rounded-lg text-center text-gray-500">
            ตั้งค่าตาราง
          </div>
          <div className="setting-table-item" onClick={onClickSettingTableName}>
            ชื่อตาราง
          </div>
          <div
            className="setting-table-item"
            onClick={onClickSettingTableDetail}
          >
            รายละเอียด
          </div>
          <div
            className="setting-table-item"
            onClick={onClickSettingTablePrice}
          >
            ราคา
          </div>
          <div className="setting-table-item" onClick={onClickSettingTableDate}>
            งวยหวย
          </div>
          <div
            className="setting-table-item"
            onClick={onClickSettingTableEmoji}
          >
            อิโมจิ
          </div>
          <div className="setting-table-item flex justify-between">
            {data.tableIsOpen ? <span>เปิดตาราง</span> : <span>ปิดตาราง</span>}
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" value="" checked={data.tableIsOpen} className="sr-only peer" onChange={onClickSettingTableIsOpen}/>
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div className="setting-table-item" onClick={onClickSettingTableDelete}>ลบตาราง</div>
        </div>
      </Drawer>
      <Modal
        isOpen={showModalSettingTableName}
        onClose={setShowModalSettingTableName}
      >
        <ContentSettingTableName data={data} onSubmit={onClickSubmitSetting} />
      </Modal>
      <Modal
        isOpen={showModalSettingTableDetail}
        onClose={setShowModalSettingTableDetail}
      >
        <ContentSettingTableDetail
          data={data}
          onSubmit={onClickSubmitSetting}
        />
      </Modal>
      <Modal
        isOpen={showModalSettingTablePrice}
        onClose={setShowModalSettingTablePrice}
      >
        <ContentSettingTablePrice data={data} onSubmit={onClickSubmitSetting} />
      </Modal>
      <Modal
        isOpen={showModalSettingTableDate}
        onClose={setShowModalSettingTableDate}
      >
        <ContentSettingTableDate data={data} onSubmit={onClickSubmitSetting} />
      </Modal>
      <Modal
        isOpen={showModalSettingTableEmoji}
        onClose={setShowModalSettingTableEmoji}
      >
        <ContentSettingTableEmoji data={data} onSubmit={onClickSubmitSetting} />
      </Modal>
    </Layout>
  );
}

const ContentSettingTableName = ({ data, onSubmit }) => {
  const [tableName, setTableName] = useState(data.tableName);
  return (
    <div>
      <div className=" bg-pink-300 p-2 text-2xl rounded-md text-gray-500 text-center">
        ชื่อตาราง
      </div>
      <input
        className="user-input"
        type={"text"}
        value={tableName}
        onChange={(e) => setTableName(e.target.value)}
      />
      <button className="submit-btn" onClick={() => onSubmit({ tableName })}>
        บันทึก
      </button>
    </div>
  );
};

const ContentSettingTableDetail = ({ data, onSubmit }) => {
  const [tableDetail, setTableDetail] = useState(data.tableDetail);
  return (
    <div>
      <div className=" bg-pink-300 p-2 text-2xl rounded-md text-gray-500 text-center">
        รายละเอียด
      </div>
      <textarea
        className="user-input"
        type={"text"}
        value={tableDetail}
        onChange={(e) => setTableDetail(e.target.value)}
      />
      <button className="submit-btn" onClick={() => onSubmit({ tableDetail })}>
        บันทึก
      </button>
    </div>
  );
};

const ContentSettingTablePrice = ({ data, onSubmit }) => {
  const [tablePrice, setTablePrice] = useState(data.tablePrice);
  return (
    <div>
      <div className=" bg-pink-300 p-2 text-2xl rounded-md text-gray-500 text-center">
        ราคา
      </div>
      <input
        className="user-input"
        type={"number"}
        value={tablePrice}
        onChange={(e) => setTablePrice(e.target.value)}
      />
      <button className="submit-btn" onClick={() => onSubmit({ tablePrice })}>
        บันทึก
      </button>
    </div>
  );
};

const ContentSettingTableDate = ({ data, onSubmit }) => {
  const [tableDate, setTableDate] = useState(data.tableDate);
  return (
    <div>
      <div className=" bg-pink-300 p-2 text-2xl rounded-md text-gray-500 text-center">
        งวยหวย
      </div>
      <input
        className="user-input"
        type={"date"}
        value={tableDate}
        onChange={(e) => setTableDate(e.target.value)}
      />
      <button className="submit-btn" onClick={() => onSubmit({ tableDate })}>
        บันทึก
      </button>
    </div>
  );
};

const ContentSettingTableEmoji = ({ data, onSubmit }) => {
  return (
    <div>
      <div className=" bg-pink-300 p-2 text-2xl rounded-md text-gray-500 text-center">
        อิโมจิ
      </div>
      <EmojiPicker
        onEmojiClick={(emoji) => onSubmit({ tableEmoji: emoji.emoji })}
      />
    </div>
  );
};

export async function getServerSideProps(context) {
  const tableId = context.query.tableId;
  return {
    props: { tableId },
  };
}
