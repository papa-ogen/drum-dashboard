import { useState } from "react";
import Modal from "./Modal";
import Metronome from "./Metronome";

const MetronomeButton = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 p-8 rounded-2xl shadow-xl hover:shadow-2xl border-2 border-indigo-400 transition-all text-left group transform hover:scale-[1.02]"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">🎵 Metronome</h2>
            <p className="text-sm text-indigo-100 font-medium">
              Click to start practicing →
            </p>
          </div>
          <div className="text-5xl animate-pulse">🎵</div>
        </div>
      </button>

      {/* Metronome Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Metronome"
        maxWidth="md"
      >
        <Metronome />
      </Modal>
    </>
  );
};

export default MetronomeButton;
