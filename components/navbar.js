import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/public/logo-no-background.svg";
import { CgProfile } from "react-icons/cg";
import Modal from "./modal";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import { MdPassword, MdLogout } from "react-icons/md";
import { useSession } from "next-auth/react";
import { putUserPassword } from "@/clientRequest/user";
import { validateInputText } from "@/lib/helper";
export default function Navbar({ page }) {
  const rounter = useRouter();
  const [drawerState, setDrawerState] = useState(false);
  const [showModalChangePassword, setShowModalChangePassword] = useState(false);
  const [showModalLogout, setShowModalLogout] = useState(false);
  const onClickSignOut = () => {
    signOut({ redirect: false });
    rounter.replace("/");
  };

  return (
    <>
      <Drawer
        open={drawerState}
        onClose={() => setDrawerState(false)}
        direction="left"
        customIdSuffix={"user"}
      >
        <div className="m-3">
          <div className="text-2xl bg-pink-300 p-2 rounded-lg text-center text-gray-500">
            ตั้งค่าผู้ใช้
          </div>
          <div
            className="setting-table-item  flex justify-between items-center"
            onClick={() => {
              setShowModalChangePassword(true);
              setDrawerState(false);
            }}
          >
            <div>เปลี่ยนรหัสผ่าน</div>
            <div>
              <MdPassword color="SkyBlue" />
            </div>
          </div>
          <div
            onClick={() => {
              setShowModalLogout(true);
              setDrawerState(false);
            }}
            className="setting-table-item  flex justify-between items-center"
          >
            <div>ออกจากระบบ</div>
            <div>
              <MdLogout color="red" />
            </div>
          </div>
        </div>
      </Drawer>
      {/* navbar */}
      <div className=" sticky top-0 flex justify-between items-center bg-pink-300 py-2 px-2 rounded-md shadow-xl">
        <div className="flex-1">
          <Image src={Logo} alt="LOGO" width="100" />
        </div>

        <ul className="flex justify-center ">
          <li className="nav-item">
            <Link
              href={"/customers"}
              className={
                page === "customers" ? "text-[#001F3F] font-black italic" : ""
              }
            >
              ลูกค้า
            </Link>
          </li>
          <li className="nav-item">
            <Link
              href={"/tables"}
              className={
                page === "tables" ? "text-[#001F3F] font-black italic" : ""
              }
            >
              ตาราง
            </Link>
          </li>
        </ul>
        <div className="flex-1 text-3xl flex justify-end">
          <CgProfile
            className=" cursor-pointer"
            onClick={() => setDrawerState(true)}
          />
        </div>
      </div>
      <Modal isOpen={showModalLogout} onClose={setShowModalLogout}>
        <div className="w-56">
          <div className="text-center">ต้องการออกจากระบบ</div>
          <div className="flex gap-3 mt-5">
            <button
              onClick={onClickSignOut}
              className="submit-btn"
              style={{ backgroundColor: "#f472b6" }}
            >
              ออกจากระบบ
            </button>
            <button
              onClick={() => setShowModalLogout(false)}
              className="submit-btn"
            >
              ยกเลิก
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={showModalChangePassword}
        onClose={setShowModalChangePassword}
      >
        <ContentChangePassword onClose={setShowModalChangePassword} />
      </Modal>
    </>
  );
}

const ContentChangePassword = ({ onClose }) => {
  const rounter = useRouter()
  const session = useSession();
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState('')

  const onSubmitChangePassword = async (e) => {
    // console.log(session)
    e.preventDefault()
    const userId = session.data.token._id;
    console.log(userId);
    if(validateInputText(password, 'password') || validateInputText(oldPassword, 'oldPassword') || validateInputText(confirmPassword, 'confirmPassword')){
      setErrorMessage('รหัสผ่านไม่ถูกต้อง')
      return
    } else if(password !== confirmPassword){
      setErrorMessage('รหัสผ่านใหม่ไม่ตรงกัน')
      return
    }else{
      const payload = {
        userId, oldPassword, password
      }
      const result = await putUserPassword(payload)
      if(result?.hasError){
        setErrorMessage(result.message)
      }else{
        signOut({ redirect: false });
        rounter.replace("/");
      }
    }
  };

  return (
    <div className="w-56">
      <div className="text-center text-2xl bg-sky-500 text-white py-2 mb-3 rounded-md">
        เปลี่ยนรหัสผ่าน
      </div>
      {errorMessage && <div>{errorMessage}</div>}
      <form onSubmit={onSubmitChangePassword}>
        <label>รหัสผ่านเก่า</label>
        <input
          className="user-input"
          type={'password'}
          required
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
        <label>รหัสผ่านใหม่</label>
        <input
          className="user-input"
          type={'password'}
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label>ยืนยันรหัสผ่านใหม่</label>
        <input
          className="user-input"
          type={'password'}
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <div className="flex gap-3 mt-5">
          <button
            type="submit"
            className="submit-btn"
            style={{ backgroundColor: "#f472b6" }}
          >
            บันทึก
          </button>
          <button onClick={() => onClose(false)} className="submit-btn">
            ยกเลิก
          </button>
        </div>
      </form>
    </div>
  );
};
