import React, { useEffect, useState } from "react";
import ConnectWalletModal from "./ConnectWalletModal";
import SelectModal, { ChainType, ModalData } from "./SelectModal";
import { connect } from "react-redux";
import { CombineReducerType } from "../../reducers";
import { connectEth, connectPolka, setSourceChain } from "../../actions";
import { FaExchangeAlt } from "react-icons/fa";
import polkadot from "../../assets/polkadot.png";
import polygon from "../../assets/polygon.png";
import revert from "../../assets/refresh.svg";
import { useNavigate } from "react-router-dom";
import { web3Accounts, web3Enable } from "@polkadot/extension-dapp";

interface HomePropsType {
  sourceChain: ChainType;
  setSourceChain: (chain: ChainType) => any;
  connectEth: (eth: any) => any;
  connectPolka: (polka: any) => any;
}

const Home = (props: any) => {
  // not able to assign HomePropsType to this

  const { setSourceChain, sourceChain, connectEth, connectPolka } = props;

  const [openModal, setOpenModal] = useState(false);
  const [modalData, setModalData] = useState({ source: false, heading: "" });
  const [source, setSource] = useState("Polkadot");
  const [target, setTarget] = useState("");
  const [departure, setDeparture] = useState("Polkadot");

  const navigate = useNavigate();

  const connectEthereum = async () => {
    if (window.ethereum) {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      const account = accounts[0];
      connectEth(account);
      return navigate("/transfer");
    } else {
      alert("EVM wallet not found!");
    }
  };

  const connectPolkadot = async () => {
    const injectedExtension = await web3Enable("Socialli Bridge");
    if (injectedExtension.length > 0) {
      const accounts = await web3Accounts();
      const account = accounts[0];
      connectPolka(account);
      return navigate("/transfer");
    } else {
      alert("Polkadot extension not found!");
    }
  };

  const handleToggle = () => {
    if (departure === "Polkadot") {
      setDeparture("Polygon");
      setSource("Polygon");
    } else {
      setDeparture("Polkadot");
      setSource("Polkadot");
    }
  };

  const handleContinue = () => {
    if (sourceChain.value === "Polygon") {
      connectEthereum();
    } else if (sourceChain.value === "Polkadot") {
      connectPolkadot();
    }
  };

  const options = [
    {
      id: 1,
      name: "Polygon",
      value: "Polygon",
      icon: "./static/polygon-icon.svg",
    },
    {
      id: 2,
      name: "Polkadot",
      value: "Polkadot",
      icon: "./static/polkadot-icon.svg",
    },
  ];

  const onChainSelectClick = (source: boolean, heading: string) => {
    const tempModalData: ModalData = {
      source,
      heading,
    };
    setModalData(tempModalData);
    // setHeading(heading);
    setOpenModal(true);
  };

  useEffect(() => {
    if (source) {
      const tmpSource = options.find((option) => option.value === source);
      if (tmpSource && tmpSource.id) {
        setSourceChain(tmpSource);
      }
    }
  }, [source]);

  return (
    // <div className="text-center flex flex-col items-center justify-center h-screen rounded-xl">
    //     <div className=" w-[500px] h-[600px] bg-white rounded-lg shadow-md border-2 text-center flex flex-col items-center justify-center">
    //     <div>
    //         <h1 className="font-bold text-[24px]">Transfer NFTs between Polkadot and Polygon</h1>
    //     </div>
    //     <div className="p-4">
    //         <div className="my-4">
    //             <div><label className="text-[20px]">Departure Chain</label></div>
    //            <div><button className="modalButton" onClick={() => onChainSelectClick(true, "Select Departure Chain")}>{source ? source : "Select Departure Chain"}</button></div>
    //         </div>
    //         <div className="my-4">
    //             <div><label className="text-[20px]">Destination Chain</label></div>
    //             <div><button disabled={!source} className="modalButton disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => onChainSelectClick(false, "Select Destination Chain")}>{target ? target : "Select Destination Chain"}</button></div>
    //         </div>
    //     </div>
    //     <div className={!(source && target) ? "hidden" : ""}>
    //     <button onClick={() => setOpenWalletModal(true)} className="border-solid border-2 h-[50px] w-[150px] rounded-xl hover:opacity-75 bg-green-600 text-slate-50">Continue</button>
    //     </div>
    //     <div><SelectModal open={openModal} setOpen={setOpenModal} data={modalData} options={options} source={source} setSource={setSource} setTarget={setTarget} /></div>
    //     <div><ConnectWalletModal open={openWalletModal} setOpen={setOpenWalletModal}/></div>
    //     </div>
    // </div>
    <div className="bg-hero h-[100vh]  bg-no-repeat bg-cover bg-center bg-fixed flex items-center justify-center ">
      <div
        style={{
          background: "rgba(255, 255, 255, .70)",
          boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.12)",
        }}
        className="w-[700px] h-[400px] rounded-md pt-10"
      >
        <h2 className="font-pop text-gray-900">
          Transfer NFTs between Polkadot and Polygon
        </h2>
        <div className="flex items-center justify-around pt-[7%]">
          <div className="flex flex-col items-center">
            <h4>Departure Chain</h4>
            <div className="bg-white p-8 border-2 border-[#5743DF] rounded-lg">
              <img src={departure === "Polkadot" ? polkadot : polygon} alt="" />
            </div>
          </div>
          <div>
            {/* <FaExchangeAlt
              size={28}
              className="cursor-pointer active:scale-90"
              onClick={handleToggle}
            /> */}
            <img
              src={revert}
              alt=""
              className="cursor-pointer w-12 h-12 rotate-90 active:scale-90"
              onClick={handleToggle}
            />
          </div>
          <div className="flex flex-col items-center">
            <h4>Destination Chain</h4>
            <div className="bg-white p-8 border-2 border-[#5743DF] rounded-lg">
              <img src={departure === "Polygon" ? polkadot : polygon} alt="" />
            </div>
          </div>
        </div>
        <div className="pt-10">
          <button
            onClick={handleContinue}
            className="px-14 py-4 bg-[#5743DF] text-white font-pop rounded-md"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: CombineReducerType) => {
  return {
    sourceChain: state.sourceChainReducer,
    ethWallet: state.ethWalletReducer,
    polkaWallet: state.polkaWalletReducer,
  };
};

export default connect(mapStateToProps, {
  setSourceChain,
  connectEth,
  connectPolka,
})(Home);
