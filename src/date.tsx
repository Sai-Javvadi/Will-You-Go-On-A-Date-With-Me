import './date.css';
import { useState } from 'react';
import emailjs from 'emailjs-com';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import dayLocaleData from 'dayjs/plugin/localeData';
import { Button, Col, Row, Calendar, Modal, Input, message } from 'antd';
import type { CalendarProps } from 'antd';

const DateGame = () => {
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [recipientEmails, setRecipientEmails] = useState<string>("");
    const [yourEmail, setYourEmail] = useState<string>("");
    const [specialEmail, setSpecialEmail] = useState<string>("")
    const [timesHovered, setTimesHovered] = useState<number>(0)
    const [open20TimesModal, setOpen20TimesModal] = useState<boolean>(false)
    const [landingPage, setLandingPage] = useState<boolean>(true)
    const [dateAskingPage, setDateAskingPage] = useState<boolean>(true)
    const [herName, setHerName] = useState<string>("")
    const [hisName, setHisName] = useState<string>("")
    const [messageApi, contextHolder] = message.useMessage();

    dayjs.extend(dayLocaleData);

    const images = Array.from({ length: 9 }, (_, i) => `/images/cupid-images/image-${i + 1}.png`);
    const handleImageChange = (timesHovered: number) => {
        if (timesHovered >= 20) return "someimage";

        const index = Math.floor(timesHovered / 2);
        return images[index] || images[0];
    };


    const onPanelChange = (value: Dayjs, mode: CalendarProps<Dayjs>['mode']) => {
        console.log(value.format('DD-MM-YYYY'), mode);
    };

    const onDateSelect = (value: Dayjs) => {
        setSelectedDate(value);
        console.log("Date selected:", value.format("DD-MM-YYYY"));
    };

    const moveBtn = () => {
        const noBtn = document.getElementsByClassName("no-btn")[0] as HTMLElement;
        if (!noBtn) return;

        const maxX = window.innerWidth - noBtn.offsetWidth - 20;
        const maxY = window.innerHeight - noBtn.offsetHeight - 20;

        const randomX = Math.random() * maxX;
        const randomY = Math.random() * maxY;

        noBtn.style.position = "fixed";
        noBtn.style.left = randomX + "px";
        noBtn.style.top = randomY + "px";
    };

    const countHover = () => {
        setTimesHovered(prev => {
            const newCount = prev + 1;
            if (newCount === 17) setOpen20TimesModal(true);
            return newCount;
        });
        console.log(timesHovered);
    }

    const openModal = () => {
        if (!selectedDate) {
            alert("Please select a date first!");
            return;
        }
        setIsModalOpen(true);
    };

    const handleSendEmail = () => {
        if (!yourEmail || !specialEmail) {
            alert("Please enter both email addresses");
            return;
        }

        setLandingPage(true)

        const toEmails = [yourEmail, specialEmail].join(", ");

        const templateParams = {
            date: selectedDate?.format("DD-MM-YYYY"),
            to_email: toEmails,
            // message: message,
            from_name: "Your Special One",
        };

        emailjs.send(
            "service_will-u-g-t-d-w-m",   // EmailJS service ID
            "template_date_temp",         // EmailJS template ID
            // {
            //     date: selectedDate?.format("DD-MM-YYYY"),
            //     to_email: recipientEmails, // multiple emails, comma-separated
            // },
            templateParams,
            "6G8dbqk7TIjwFrSX8"            // EmailJS public key
        ).then(() => {
            alert("💌 Email sent successfully to: " + recipientEmails);
            setIsModalOpen(false);
            setRecipientEmails("");
        }).catch((err) => {
            alert("Failed to send email: " + err.text);
        });
    };

    const handleLandingPage = () => {
        if (hisName.trim() === "" || herName.trim() === "") {
            messageApi.open({
                type: "error",
                content: "The dreamers names can't be empty",
                icon: <span style={{ fontSize: "18px" }}>💔</span>,
                style: { marginTop: "5vh" },
                // duration:100
            });
            return;
        }

        setLandingPage(false);
        setDateAskingPage(true);
    };

    const handle20TimesModalCancel = () => {
        const currentHerName = herName;
        const currentHisName = hisName;

        setOpen20TimesModal(false);
        setTimesHovered(0);
        setLandingPage(false);
        setHerName("");
        setHisName("");

        messageApi.open({
            type: "error",
            content: `${currentHerName} doesn't want to go on a date with ${currentHisName}`,
            icon: <span style={{ fontSize: "18px" }}>💔</span>,
            style: { marginTop: "5vh" },
        });
    };


    return (
        <div className='main-div'>
            {contextHolder}

            {landingPage ? (
                <div className='landing-page' >
                    <Row style={{ display: "flex", justifyContent: "space-around", alignItems: "center", paddingTop: "61vh", }} >
                        <Row className='his-her-name-row'>
                            <Col span={21} style={{ display: "flex", flexDirection: "column", alignItems: "start" }} >
                                <p className='landing-page-text' style={{ marginTop: "-1vh", textAlign: "center" }} > Two names… two souls… one story waiting to unfold.</p>
                                <div style={{ display: "flex" }} >
                                    <p className='landing-page-text' style={{ marginTop: "0px", marginRight: "7px" }} >  What's your name, dear traveler?</p>
                                    <Input value={herName} onChange={(e) => setHerName(e.target.value)} className='his-her-name-input' />
                                </div>
                                <div style={{ display: "flex" }}  >
                                    <p className='landing-page-text' style={{ marginTop: "0px", marginRight: "7px" }} >And the name of the one who lights your soul? </p>
                                    <Input value={hisName} onChange={(e) => setHisName(e.target.value)} className='his-her-name-input' />
                                </div>
                            </Col>
                            <Col span={2} style={{ display: "flex", alignItems: "center", justifyContent: "center", marginLeft: "10px" }} >
                                <div onClick={handleLandingPage} className='landing-page-btn' >
                                    <svg className='landing-svg' viewBox="0 0 512 512" style={{ height: "24px", width: "24px", marginLeft: "2px", }}>
                                        <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"> </path>
                                    </svg>
                                </div>
                            </Col>
                        </Row>
                    </Row>
                </div>
            ) : (
                dateAskingPage ? (
                    <>
                        <div className='date-asking-page'  >
                            <div className='text-div'>
                                <p style={{ margin: "10px" }} > <span style={{ fontFamily: "HestinaFontbyKeithzo", fontSize: "1.5rem" }} >  {herName.charAt(0).toUpperCase() + herName.slice(1).toLowerCase()} </span> will you go on a date with me ? </p>
                                <div style={{ width: "69%", background: "red", height: "80%", display: "flex", margin: "0 auto", borderRadius: "15px" }} >
                                    <img src={handleImageChange(timesHovered)} alt='cupid-image' style={{ borderRadius: "15px" }} />
                                </div>
                            </div>

                            {/* <button onClick={() => [setLandingPage(true), setDateAskingPage(false)]} style={{ position: "absolute", top: "100px", left: "700px" }} > back </button> */}

                            <Row gutter={[16, 16]} >
                                <Col span={12} >
                                    <button className='yes-btn' onClick={() => { setDateAskingPage(false) }} > Yes </button>
                                </Col>
                                <Col span={12} >
                                    <button className='no-btn' onMouseOver={() => { moveBtn(); countHover(); }}> No </button>
                                </Col>
                            </Row>

                            <Modal
                                footer={null}
                                open={open20TimesModal}
                                onCancel={() => [setOpen20TimesModal(false), setTimesHovered(0)]}
                                className='do-you-really-love-me-modal'
                                title="Important Love Survey 💌"
                            >
                                <h2>Do you wanna go out with me ?</h2>
                                <div style={{ display: "flex", justifyContent: "end", gap: "10px", marginTop: "20px" }}>
                                    <Button
                                        onClick={handle20TimesModalCancel}
                                        style={{ backgroundColor: "white", borderColor: "#ff5a76", color: "#ff5a76", padding: "6px 16px 8px" }}
                                    >
                                        Hmm... No..!
                                    </Button>

                                    <Button
                                        onClick={() => { setDateAskingPage(false); setOpen20TimesModal(false); }}
                                        style={{ backgroundColor: "#ff5a76", borderColor: "#ff5a76", color: "white", padding: "6px 16px 8px" }}
                                    >
                                        Of course, I do! 😍
                                    </Button>
                                </div>
                            </Modal>
                        </div >
                    </>
                ) : (
                    <div className='calendar-page' >
                        <div>
                            <Button onClick={() => setLandingPage(true)}>Back</Button>
                        </div>
                        <Row className='photo-calendar-row'>
                            <Col span={15} style={{ background: "pink", height: "97%", width: "97%", borderRadius: "20px" }}>
                            <img src='/images/calendar-date-image.png' alt='calendar-date-image' style={{ width: "100%", height: "100%", borderRadius: "20px" }} />
                            </Col>
                            <Col span={5} style={{ display: "flex", flexDirection: "column", margin: "0 auto", alignItems: "center", }} >

                                <p className='calendar-text' >When can i take this beauty out?</p>
                                <div style={{ width: 300, borderRadius: "20px", }}>
                                    <Calendar fullscreen={false} onPanelChange={onPanelChange} onSelect={onDateSelect} />
                                </div>

                                <Button style={{ width: "130px", marginTop: "10px", backgroundColor: "#f4788d", color: "white", borderRadius: "20px", border: "none" }} onClick={openModal}>
                                    Save the date 💖
                                </Button>
                            </Col>
                        </Row>

                        <Modal
                            title="Send Email"
                            open={isModalOpen}
                            onCancel={() => setIsModalOpen(false)}
                            onOk={handleSendEmail}
                            okText="Send Email 💌"
                            okButtonProps={{
                                style: {
                                    backgroundColor: "#ff5a76",
                                    borderColor: "#ff5a76",
                                    color: "white",
                                    padding: "6px 16px 8px",
                                },
                            }}
                            cancelButtonProps={{
                                style: {
                                    backgroundColor: "white",
                                    borderColor: "#ff5a76",
                                    color: "#ff5a76",
                                    padding: "6px 16px 8px",
                                },
                            }}
                        >
                            <label>Your Email:</label>
                            <Input className='email-inputs' style={{ marginBottom: "10px" }}
                                value={yourEmail}
                                onChange={(e) => setYourEmail(e.target.value)}
                            />

                            <label>Special Person's Email:</label>
                            <Input className='email-inputs' style={{ marginBottom: "10px" }}
                                value={specialEmail}
                                onChange={(e) => setSpecialEmail(e.target.value)}
                            />
                            <p style={{ color: "#FF5A76", fontSize: "10px", marginTop: "8px" }}>
                                This special invitation is sent with love by <b>Sai Javvadi</b> 💌
                            </p>

                            {/* <label>Message:</label> */}
                            {/* <textarea
                            style={{ width: "100%", minHeight: "80px" }}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        /> */}
                        </Modal>
                    </div>
                ))
            }
        </div>
    );
};

export default DateGame;
