import React from 'react';
import { Modal } from 'semantic-ui-react';

export interface ChainType {
    id: number;
    name: string;
    value: string;
    icon: string;
}

interface SelectModalType{
    options: ChainType[];
    data: ModalData,
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    source: string,
    setSource: React.Dispatch<React.SetStateAction<string>>;
    setTarget: React.Dispatch<React.SetStateAction<string>>;
}

export interface ModalData {
    heading: string;
    source: boolean
};

const SelectModal = (props: SelectModalType) => {

    const { data, open, setOpen, setSource, setTarget, source } = props;
    let options = props.options;

    if(!data.source){
        options = options.filter(option => option.value !== source)
    }

    const onClickHandler = (value: string) => {
        if(data.source){
            setSource(value);

        }else{
            setTarget(value);
        }
        setOpen(false);
    }


    const BlockchainList = options.map(option => {
        return (
            <li key={option.id} className="wlistItem" onClick={() => onClickHandler(option.value)}>
                <img src={option.icon} alt={`${option.name} Icon`}/>
                <p>{option.name}</p>
            </li>
        )
    })

    return (
        <Modal
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
          open={open}
          style={{width: "400px", textAlign: "center", height: "600px"}}
        >
            <Modal.Header>{data.heading}</Modal.Header>
            <Modal.Content>
                <ul>
                    {BlockchainList}
                </ul>
            </Modal.Content>
        </Modal>
    );
};

export default SelectModal;
