import React, { useEffect } from 'react';
import { NftType } from '.';


interface NftCardProps {
    nft: NftType;
    selectedNft: NftType;
    setSelectedNft: React.Dispatch<React.SetStateAction<NftType>>;
}

const NftCard = (props: NftCardProps) => {

    const { nft, selectedNft, setSelectedNft } = props;

    useEffect(() => {

    }, [selectedNft]);

    const nftCardClass = "p-2 m-2"
    const imageClass = "w-[250px] h-[250px] rounded-lg hover:shadow-2xl hover:cursor-pointer";
    const selectedNftClass = selectedNft === nft ? "absolute left-4 top-4 w-[20px] h-[20px] rounded-full border-solid border-2 bg-blue-500" : "absolute left-4 top-4 w-[20px] h-[20px] rounded-full border-solid border-2";

    return (
        <div key={nft.tokenId} className={nftCardClass}>
            {/* Content  */}
            <div>
                {/* Selected Radio Button */}
                <div></div>
                {/* Metadata */}
                <div className="relative hover:scale-105 transition duration-250 ease-in-out border-1 border-solid rounded-lg" onClick={e => {
                        e.stopPropagation();
                        setSelectedNft(nft);
                    }}
                >
                    <div className={selectedNftClass}>
                    </div>
                    <img className={imageClass} src={nft.image || './static/no-image.png'} alt={`Nft: ${nft.tokenId}`} />
                </div>
            </div>
            {/* Footer */}
            <div>

            </div>
        </div>
    );
}

export default NftCard;
