import React, { useRef, useEffect, useState } from "react";
import "../../panels/QRCodePage/QRcode.css";
import QRcode from 'qrcode';

const GetQRCode = ({ text }) => {
    const [src, setSrc] = useState("");

    useEffect(() => {
        QRcode.toDataURL(text).then((data) => {
            setSrc(data);
        });
    }, []);

    return (
        <div className="QR-code">
            <img src={src} className="QR-code_img"></img>
        </div>
    );
};

export default GetQRCode;