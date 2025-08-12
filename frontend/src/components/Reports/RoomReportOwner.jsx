
import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import useRoom from '../RoomOwner/RoomHook';
import { useParams } from 'react-router';
import { QRCodeCanvas } from 'qrcode.react';
import { Box, VStack, Button, Center, Container, Heading, HStack, Switch } from '@chakra-ui/react';
// import { colorPalettes } from "compositions/lib/color-palettes"

const RoomReportOwner = () => {
    const { t } = useTranslation();
    const [roomName, setRoomName] = useState('');
    const [buildingName, setBuildingName] = useState('');
    const [showSensorData, setShowSensorData] = useState(null);
    const [isChecked, setIsChecked] = useState(false);

    const { roomId, buildingId } = useParams();
    const { rooms } = useRoom(buildingId);

    const qrCodeRef = useRef(null);

    useEffect(() => {
        const roomFilter = rooms.find(room => room.id === Number(roomId));
        if (roomFilter) {
            setRoomName(roomFilter.name);
            setBuildingName(roomFilter.building_name);
        }
    }, [rooms, roomId]);

    const downloadQRCode = () => {
        const canvas = qrCodeRef.current.querySelector('canvas');
        if (canvas) {
            const image = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = image;
            link.download = t('create_room_report.qr_code_filename', { roomName, buildingName });
            link.click();
        }
    };

    const printQRCode = () => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            alert(t('create_room_report.popup_blocked'));
            return;
        }

        const canvas = qrCodeRef.current?.querySelector('canvas');
        if (!canvas) {
            printWindow.document.write(`<p>${t('create_room_report.qr_code_not_ready')}</p>`);
            printWindow.document.close();
            printWindow.focus();
            return;
        }

        let image;
        try {
            image = canvas.toDataURL('image/png');
        } catch (err) {
            console.error('Canvas toDataURL failed:', err);
            printWindow.document.write(`<p>${t('create_room_report.qr_code_render_failed')}</p>`);
            printWindow.document.close();
            return;
        }

        printWindow.document.write(`
            <html>
                <head>
                    <title>${t('create_room_report.qr_code_title')}</title>
                    <style>
                        body {
                            text-align: center;
                            font-family: Arial, sans-serif;
                            margin: 40px;
                        }
                        .feedback-text {
                            font-size: 24px;
                            margin-top: 200px;
                            margin-bottom: 100px;
                        }
                        .qr-img {
                            width: 300px;
                            height: 300px;
                        }
                    </style>
                </head>
                <body>
                    <div class="feedback-text">
                        <h2>${t('create_room_report.feedback_text_fi')}</h2>
                        <h2>${t('create_room_report.feedback_text_en')}</h2>
                    </div>
                    <img class="qr-img" src="${image}" alt="${t('create_room_report.qr_code_alt')}" />
                </body>
            </html>
        `);
        printWindow.document.close();

        const img = printWindow.document.querySelector('.qr-img');
        if (img) {
            img.onload = () => {
                printWindow.focus();
                printWindow.print();
                printWindow.onafterprint = () => printWindow.close();
                setTimeout(() => printWindow.close(), 1000);
            };
            img.onerror = () => {
                alert(t('create_room_report.qr_code_load_failed'));
                printWindow.close();
            };
        } else {
            alert(t('create_room_report.qr_code_insert_failed'));
            printWindow.close();
        }
    };

    const generateRandom = (length = 10) => {
        let result = '';
        while (result.length < length) {
            result += Math.random().toString(36).substring(2);
        }
        return result.substring(0, length);
    };
    const [token1] = useState(generateRandom());
    const [token2] = useState(generateRandom());

    useEffect(() => {
        const token = isChecked
            ? 'x8Kbf6R4Ti'
            : 'mUDfq8mo33';
        setShowSensorData(token);
    }, [isChecked]);

    const link = `http://localhost:5173/room/feedback/${roomId}/${token1}${showSensorData}${token2}/`;

    const handleCopy = async () => {
        const fallbackCopyTextToClipboard = (text) => {
            const textArea = document.createElement("textarea");
            textArea.value = text;
            textArea.style.position = "fixed";
            textArea.style.top = "0";
            textArea.style.left = "0";
            textArea.style.opacity = "0";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            try {
                const successful = document.execCommand("copy");
                if (successful) {
                    alert(t('create_room_report.link_copied'));
                } else {
                    alert(t('create_room_report.link_copy_failed'));
                }
            } catch (err) {
                console.error("Fallback copy failed: ", err);
                alert(t('create_room_report.link_copy_failed'));
            }

            document.body.removeChild(textArea);
        };

        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(link);
                alert(t('create_room_report.link_copied'));
            } else {
                fallbackCopyTextToClipboard(link);
            }
        } catch (err) {
            console.error("Copy failed: ", err);
            fallbackCopyTextToClipboard(link);
        }
    };

    return (
        <Box mt={5} p={4} rounded={8}>
            <HStack gap={4} justifyContent="center">
                <VStack shadow="3px 3px 15px 5px rgb(75, 75, 79)" rounded={8} p={4} w={"500px"}>
                    <Heading my={"20px"}>{t('create_room_report.qr_code_heading')}</Heading>
                    <Box>
                        <Switch.Root
                            checked={isChecked}
                            onCheckedChange={(e) => setIsChecked(e.checked)}
                            colorPalette={"blue"}
                        >
                            <Switch.HiddenInput />
                            <Switch.Control>
                                <Switch.Thumb />
                            </Switch.Control>
                            <Switch.Label fontWeight={"bold"} fontSize={"16px"}>{t('create_room_report.show_sensor_data')}</Switch.Label>
                        </Switch.Root>
                    </Box>
                    <Box>
                        <Center ref={qrCodeRef} my={4}>
                            <VStack border={"1px solid"} p={"20px"}>
                                <QRCodeCanvas value={link} size={200} />
                            </VStack>
                        </Center>
                        <HStack maxW={"480px"} justifyContent={"space-between"}>
                            <Box border={"1px solid"} p={"10px"} rounded={"5px"} fontStyle={'italic'} maxW={"70%"}>{link}</Box>
                            <Button onClick={handleCopy} height={"70px"}>{t('create_room_report.copy_link')}</Button>
                        </HStack>
                        <HStack my={4} justifyContent={"space-evenly"}>
                            <Button onClick={downloadQRCode}>{t('create_room_report.download_qr_code')}</Button>
                            <Button onClick={printQRCode}>{t('create_room_report.print_qr_code')}</Button>
                        </HStack>
                    </Box>
                </VStack>
            </HStack>
        </Box>
    );
};

export default RoomReportOwner;