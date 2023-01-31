import React, { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "react-query";
import {
  getTable,
  putSettingTable,
  deleteSettingTable,
} from "@/clientRequest/tables";
import Layout from "@/components/layout";
import { formatDate } from "@/lib/helper";
import TableNumber from "@/components/tableNumber";
import TableCustomer from "@/components/tableCustomer";
import TableNumbersCustomers from "@/components/tableNumbersCustomers";
import Drawer from "react-modern-drawer";
import Modal from "@/components/modal";
import EmojiPicker from "emoji-picker-react";
import "react-modern-drawer/dist/index.css";
import { useRouter } from "next/router";
import { SwatchesPicker } from "react-color";
import { BsCalendar3 } from "react-icons/bs";
import { TbCurrencyBaht, TbTable } from "react-icons/tb";
import { BiMessageDetail } from "react-icons/bi";
import { RiDeleteBin2Line } from "react-icons/ri";

export default function Table({ tableId }) {
  const rounter = useRouter();
  const [loading, setLoading] = useState(false);
  const [drawerState, setDrawerState] = useState(false);
  const [enableEmoji, setEnableEmoji] = useState(true);
  const [showTableCustomer, setShowTableCustomer] = useState(true);
  const [countCustomer, setCountCustomer] = useState(0);
  const [countNumber, setCountNumber] = useState(0);
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
  const [
    showModalSettingTableNumberColor,
    setShowModalSettingTableNumberColor,
  ] = useState(false);
  const [
    showModalSettingTableBorderColor,
    setShowModalSettingTableBorderColor,
  ] = useState(false);
  const [showModalDeleteTable, setShowModalDeleteTable] = useState(false);
  const queryClient = useQueryClient();
  const putSettingTableMutation = useMutation(putSettingTable, {
    onSuccess: (response) => {
      queryClient.prefetchQuery(["getTable", tableId], getTable);
      setShowModalSettingTableName(false);
      setShowModalSettingTableDetail(false);
      setShowModalSettingTablePrice(false);
      setShowModalSettingTableDate(false);
      setShowModalSettingTableEmoji(false);
      setShowModalSettingTableNumberColor(false);
      setShowModalSettingTableBorderColor(false);
      setLoading(false);
    },
  });

  const deleteSettingTableMutation = useMutation(deleteSettingTable, {
    onSuccess: (response) => {
      setShowModalDeleteTable(false);
      rounter.replace("/tables");
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
      tableId: data._id,
    };
    setDrawerState(false);
    setLoading(true);
    putSettingTableMutation.mutate(payload);
  };
  const onClickSettingTableDelete = () => {
    if (data.tableIsOpen) return;
    setDrawerState(false);
    setShowModalDeleteTable(true);
  };
  const onClickSettingTableNumberColor = () => {
    setDrawerState(false);
    setShowModalSettingTableNumberColor(true);
  };
  const onClickSettingTableBorderColor = () => {
    setDrawerState(false);
    setShowModalSettingTableBorderColor(true);
  };
  const onClickSubmitSetting = (obj) => {
    const key = Object.keys(obj)[0];
    console.log(key);
    if (data[key] == obj[key] || obj[key] === "") {
      console.log("ไม่มีการเปลี่ยนแปลง");
      return;
    } else {
      console.log(obj);
      obj.tableId = data._id;
      putSettingTableMutation.mutate(obj);
    }
  };
  const countSaleNumber = () => {
    const { tableNumbers } = data;
    const sale = tableNumbers.filter((n) => n.customers.length > 0);
    return sale.length;
  };
  const repeatNumber = () => {
    const { tableNumbers } = data;
    const sale = tableNumbers.filter((n) => n.customers.length > 1);
    return sale.length;
  };
  const countRepeatNumber = () => {
    const { tableNumbers } = data;
    const repaet = tableNumbers.filter((n) => n.customers.length > 1);
    const numbers = repaet.reduce((a, b) => a + b.customers.length, 0);
    return numbers - repaet.length;
  };
  const paidNumber = () => {
    const { tableNumbers } = data;
    const allSale = tableNumbers.reduce((a, b) => a + b.customers.length, 0);
    const paid = tableNumbers.reduce(
      (a, b) => a + b.customers.filter((a) => a.payment).length,
      0
    );
    return `${paid}/${allSale}`;
  };
  if (isLoading) return <div>Table is Loading</div>;
  if (isError) return <div>Table Got Error {error}</div>;
  // console.log(data)
  return (
    <Layout page={"tables"}>
      {/* <div className="flex justify-center"></div> */}
      <main className="mt-5">
        <div
          className="text-center text-2xl cursor-pointer"
          onClick={() => setDrawerState(true)}
        >
          {data.tableName}
        </div>
        <div className="text-center">{data.tableDetail}</div>
        <div className="text-center">ราคา {data.tablePrice}</div>
        <div className="text-center">{formatDate(data.tableDate)}</div>
        <TableNumber data={data} enableEmoji={enableEmoji} />
        <div className="mt-3 border border-gray-400 rounded-lg p-3 shadow-xl">
          <div className="text-center">รายงานสรุป</div>
          <div>ลูกค้าซื้อ {countCustomer} คน</div>
          <div>เลขที่ขายได้ {countSaleNumber()} เลข</div>
          <div>เลขซ้ำ {repeatNumber()} เลข</div>
          <div>จำนวนเลขซ้ำ {countRepeatNumber()}</div>
          <div>จ่ายแล้ว {paidNumber()}</div>
        </div>
        {showTableCustomer ? (
          <>
            <button
              className="block mx-auto my-5 bg-green-400 text-white px-8 py-2 rounded-lg shadow-md shadow-green-300"
              onClick={() => setShowTableCustomer(!showTableCustomer)}
            >
              <div>รายการตามลูกค้า</div>
              <div>ลูกค้าซื้อ {countCustomer} คน</div>
            </button>
            <TableCustomer data={data} setCountCustomer={setCountCustomer} />
          </>
        ) : (
          <>
            <button
              className="block mx-auto my-5 bg-pink-400 text-white px-8 py-2 rounded-lg shadow-md shadow-pink-300"
              onClick={() => setShowTableCustomer(!showTableCustomer)}
            >
              <div>รายการตามตัวเลข</div>
              <div>ลูกค้าซื้อ {countNumber} เลข</div>
            </button>
            <TableNumbersCustomers
              data={data}
              setCountNumber={setCountNumber}
            />
          </>
        )}
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

          <div
            className="setting-table-item  flex justify-between items-center"
            onClick={onClickSettingTableName}
          >
            <div>ชื่อตาราง</div>
            <div>
              <TbTable color="DeepSkyBlue" size={24} />
            </div>
          </div>

          <div
            className="setting-table-item flex justify-between items-center"
            onClick={onClickSettingTableDetail}
          >
            <div>รายละเอียด</div>
            <div>
              <BiMessageDetail color="DeepSkyBlue" size={24} />
            </div>
          </div>

          <div
            className="setting-table-item flex justify-between items-center"
            onClick={onClickSettingTablePrice}
          >
            <div>ราคา</div>
            <div>
              <TbCurrencyBaht color="DeepSkyBlue" size={24} />
            </div>
          </div>

          <div
            className="setting-table-item flex justify-between items-center"
            onClick={onClickSettingTableDate}
          >
            <div>งวยหวย</div>
            <div>
              <BsCalendar3 color="DeepSkyBlue" />
            </div>
          </div>

          <div
            className="setting-table-item flex justify-between"
            onClick={onClickSettingTableEmoji}
          >
            <div>อิโมจิ</div>
            <div>{data.tableEmoji}</div>
          </div>

          <div
            className="setting-table-item flex justify-between"
            onClick={onClickSettingTableNumberColor}
          >
            <div>เปลี่ยนสีตัวเลข</div>
            <div
              className=" w-7 h-7 rounded-full aspect-square"
              style={{ backgroundColor: data.tableNumberColor }}
            ></div>
          </div>

          <div
            className="setting-table-item flex justify-between"
            onClick={onClickSettingTableBorderColor}
          >
            <div>เปลี่ยนสีตาราง</div>
            <div
              className=" w-7 h-7 rounded-full aspect-square"
              style={{ backgroundColor: data.tableBorderColor }}
            ></div>
          </div>

          <div className="setting-table-item flex justify-between">
            {enableEmoji ? (
              <span>เปิดใช้งานอิโมจิ</span>
            ) : (
              <span>ปิดใช้งานอิโมจิ</span>
            )}
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                value=""
                checked={enableEmoji}
                className="sr-only peer"
                onChange={() => setEnableEmoji(!enableEmoji)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="setting-table-item flex justify-between">
            {data.tableIsOpen ? <span>เปิดตาราง</span> : <span>ปิดตาราง</span>}
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                value=""
                checked={data.tableIsOpen}
                className="sr-only peer"
                onChange={onClickSettingTableIsOpen}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {!data.tableIsOpen ? (
            <div
              className="setting-table-item flex justify-between items-center"
              onClick={onClickSettingTableDelete}
            >
              <div>ลบตาราง</div>
              <div>
                <RiDeleteBin2Line color="red" size={24} />
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      </Drawer>
      <Modal
        isOpen={showModalSettingTableName}
        onClose={setShowModalSettingTableName}
        loading={putSettingTableMutation.isLoading}
      >
        <ContentSettingTableName data={data} onSubmit={onClickSubmitSetting} />
      </Modal>
      <Modal
        isOpen={showModalSettingTableDetail}
        onClose={setShowModalSettingTableDetail}
        loading={putSettingTableMutation.isLoading}
      >
        <ContentSettingTableDetail
          data={data}
          onSubmit={onClickSubmitSetting}
        />
      </Modal>
      <Modal
        isOpen={showModalSettingTablePrice}
        onClose={setShowModalSettingTablePrice}
        loading={putSettingTableMutation.isLoading}
      >
        <ContentSettingTablePrice data={data} onSubmit={onClickSubmitSetting} />
      </Modal>
      <Modal
        isOpen={showModalSettingTableDate}
        onClose={setShowModalSettingTableDate}
        loading={putSettingTableMutation.isLoading}
      >
        <ContentSettingTableDate data={data} onSubmit={onClickSubmitSetting} />
      </Modal>
      <Modal
        isOpen={showModalSettingTableEmoji}
        onClose={setShowModalSettingTableEmoji}
        loading={putSettingTableMutation.isLoading}
      >
        <ContentSettingTableEmoji data={data} onSubmit={onClickSubmitSetting} />
      </Modal>
      <Modal
        isOpen={showModalSettingTableNumberColor}
        onClose={setShowModalSettingTableNumberColor}
        loading={putSettingTableMutation.isLoading}
      >
        <ContentSettingTableColor
          onSubmit={onClickSubmitSetting}
          field={"tableNumberColor"}
        />
      </Modal>
      <Modal
        isOpen={showModalSettingTableBorderColor}
        onClose={setShowModalSettingTableBorderColor}
        loading={putSettingTableMutation.isLoading}
      >
        <ContentSettingTableColor
          onSubmit={onClickSubmitSetting}
          field={"tableBorderColor"}
        />
      </Modal>
      <Modal
        isOpen={showModalDeleteTable}
        onClose={setShowModalDeleteTable}
        loading={deleteSettingTableMutation.isLoading}
      >
        <div className="w-72">
          <div className="text-center text-2xl text-red-700 my-5">
            ต้องการลบตาราง ?
          </div>
          <div className="flex justify-center gap-3">
            <button
              className="submit-btn"
              style={{ backgroundColor: "red" }}
              onClick={() => {
                // setShowModalDeleteTable(false);
                deleteSettingTableMutation.mutate({ tableId });
              }}
            >
              ลบตาราง
            </button>
            <button
              className="submit-btn"
              onClick={() => setShowModalDeleteTable(false)}
            >
              ยกเลิก
            </button>
          </div>
        </div>
      </Modal>
      <Modal isOpen={loading} onClose={setLoading} loading={loading}></Modal>
    </Layout>
  );
}

const ContentSettingTableName = ({ data, onSubmit }) => {
  const [tableName, setTableName] = useState(data.tableName);
  return (
    <div className="w-72">
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
    <div className="w-72">
      <div className=" bg-pink-300 p-2 text-2xl rounded-md text-gray-500 text-center">
        รายละเอียด
      </div>
      <textarea
        className="user-input"
        rows={5}
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

const ContentSettingTableColor = ({ onSubmit, field }) => {
  const onChangeComplete = (color, event) => {
    const payload = {};
    payload[field] = color.hex;
    onSubmit(payload);
  };
  return (
    <SwatchesPicker height={"560px"} onChangeComplete={onChangeComplete} />
  );
};

export async function getServerSideProps(context) {
  const tableId = context.query.tableId;
  return {
    props: { tableId },
  };
}
