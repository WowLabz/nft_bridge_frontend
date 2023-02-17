import React, { useState } from "react";
import { Modal } from "semantic-ui-react";

interface ImportModalPropsType {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleAddCustomToken: (
    contractAddress: string,
    tokenId: string | number
  ) => Promise<void>;
}

const ImportModal = (props: ImportModalPropsType) => {
  const { open, setOpen, handleAddCustomToken } = props;
  const [contractAddress, setContractAddress] = useState<string>("");
  const [tokenId, setTokenId] = useState<string>("");
  const inputClassName =
    "border border-[#ccccf1] p-[16px] shadow-sm rounded-[20px] w-[100%] h-[46px] focus:outline-gray-400";
  const importButtonClassName =
    "w-[99px] h-[46px] border bg-[#5743DF] mr-3 font-pop text-[#fff] rounded-[40px] disabled:opacity-50 disabled:cursor-not-allowed";
  const cancelButtonClassName =
    "w-[99px] h-[46px] border border-[#5743DF] font-pop text-[#5743DF] rounded-[40px]";
  const handleClose = () => {
    setContractAddress("");
    setTokenId("");
    setOpen(false);
  };
  const handleImport = () => {
    handleAddCustomToken(contractAddress, tokenId);
    handleClose();
  };
  return (
    <Modal
      open={open}
      onOpen={() => setOpen(true)}
      onClose={handleClose}
      style={{ width: "350px", height: "300px" }}
    >
      <Modal.Header style={{ fontFamily: "Poppins", fontWeight: "400" }}>
        Import NFT
      </Modal.Header>
      <Modal.Content style={{ fontFamily: "Poppins", fontWeight: "400" }}>
        <div className="flex flex-col justify-center">
          <div className="flex flex-col m-2 ">
            <label className="pb-2">1. Paste Contract Address</label>
            <input
              type="text"
              className={inputClassName}
              placeholder="0x..."
              value={contractAddress}
              onChange={(e) => setContractAddress(e.target.value)}
            />
          </div>
          <div className="flex flex-col m-2">
            <label className="pb-2">2. Paste Token Id</label>
            <input
              type="text"
              className={inputClassName}
              placeholder="Enter token id"
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value)}
            />
          </div>
        </div>
      </Modal.Content>
      <Modal.Actions>
        <button
          disabled={!contractAddress || !tokenId}
          className={importButtonClassName}
          onClick={handleImport}
        >
          Import
        </button>
        <button
          className={cancelButtonClassName}
          onClick={(e) => setOpen(false)}
        >
          Cancel
        </button>
      </Modal.Actions>
    </Modal>
  );
};

export default ImportModal;
