import { useState, useEffect } from "react";
import Auth from "@/components/user/auth";
import ModalWindow from "../../modal/modalWindow";
import Reg from "../../user/reg";

interface AuthModalProps {
  active: boolean;
  setActive: (active: boolean) => void;
  flashShowModal?: boolean; // опционально, чтобы открыть по flash
}

export const AuthModal = ({ active, setActive, flashShowModal }: AuthModalProps) => {
  const [formType, setFormType] = useState<'auth' | 'reg'>('auth');

  useEffect(() => {
    if (flashShowModal !== undefined) {
      setActive(flashShowModal);
    }
  }, [flashShowModal, setActive]);

  return (
    <ModalWindow active={active} setActive={setActive}>
      <div style={{ display: 'flex', gap: '20px', justifyContent: "center", alignItems: "start" }}>
        <button className={formType === 'auth' ? "check-btn active" : "check-btn"} onClick={() => setFormType('auth')}>
          Вход
        </button>
        <button className={formType === 'reg' ? "check-btn active" : "check-btn"} onClick={() => setFormType('reg')}>
          Регистрация
        </button>
      </div>
      {formType === 'auth' ? <Auth /> : <Reg />}
    </ModalWindow>
  );
};
