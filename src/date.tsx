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
    const [yourEmail, setYourEmail] = useState<string>("");
    const [specialEmail, setSpecialEmail] = useState<string>("")
    const [timesHovered, setTimesHovered] = useState<number>(0)
    const [open20TimesModal, setOpen20TimesModal] = useState<boolean>(false)
    const [landingPage, setLandingPage] = useState<boolean>(true)
    const [dateAskingPage, setDateAskingPage] = useState<boolean>(false)
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

        const selectedDateStr = selectedDate?.format("DD-MM-YYYY");

        const recipients = [
            { email: yourEmail, name: herName },
            { email: specialEmail, name: hisName }
        ];

        recipients.forEach((recipient) => {
            const templateParams = {
                date: selectedDateStr,
                to_email: recipient.email,
                recipientName: recipient.name,
            };

            emailjs.send(
                "service_will-u-g-t-d-w-m",   // Service ID
                "template_date_temp",         // Template ID
                templateParams,
                "6G8dbqk7TIjwFrSX8"           // Public key
            ).then(() => {
                console.log(`💌 Email sent successfully to ${recipient.email}`);
            }).catch((err) => {
                console.error("Failed to send email:", err.text);
            });
        });

        messageApi.open({
            type: "error",
            content: "Emails sent successfully!",
            icon: <span style={{ fontSize: "18px" }}>💌</span>,
            style: { marginTop: "5vh" },
            className: "alert-message",
            // duration:100
        });
        setIsModalOpen(false);
        setTimesHovered(0);
        setLandingPage(true);
        setHerName("");
        setHisName("");
        setYourEmail("");
        setSpecialEmail("");
    };

    const handleLandingPage = () => {
        if (hisName.trim() === "" || herName.trim() === "") {
            messageApi.open({
                type: "error",
                content: "The dreamers names can't be empty",
                icon: <span style={{ fontSize: "18px" }}>💔</span>,
                style: { marginTop: "5vh" },
                className: "alert-message",
                // duration: 100
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
        setLandingPage(true);
        setHerName("");
        setHisName("");

        messageApi.open({
            type: "error",
            content: `${currentHerName} doesn't want to go on a date with ${currentHisName}`,
            icon: <span style={{ fontSize: "18px" }}>💔</span>,
            style: { marginTop: "5vh" },
            className: "alert-message",
        });
    };

    return (
        <div className='main-div'>
            {contextHolder}

            {landingPage ? (
                <div className='landing-page' >
                    <Row className="his-her-name-row-container">
                        <Row className='his-her-name-row'>
                            <Col sm={24} md={24} lg={22} xl={21} xxl={21} className='' style={{ display: "flex", flexDirection: "column", alignItems: "start" }} >
                                <p className='landing-page-text' style={{ marginTop: "-1vh", textAlign: "center" }} > Your names are the whispers that destiny has been waiting for.</p>
                                <div className='names-input-div'>
                                    <p className='landing-page-text' > Whisper your name, beloved traveler of the heart.</p>
                                    <Input value={herName} onChange={(e) => setHerName(e.target.value)} className='his-her-name-input' />
                                </div>
                                <div className='names-input-div'>
                                    <p className='landing-page-text' >And Who holds the key to your heart's secret garden? </p>
                                    <Input value={hisName} onChange={(e) => setHisName(e.target.value)} className='his-her-name-input' />
                                </div>
                            </Col>
                            <Col sm={24} md={24} lg={2} xl={2} xxl={2} className='landing-enter-btn'  >
                                <div onClick={handleLandingPage} className='landing-page-btn' >
                                    <svg className='landing-svg' viewBox="0 0 512 512" style={{ height: "20px", width: "20px", marginLeft: "2px", }}>
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
                                <p className='will-you-go-on-a-date-with-me-text'  >
                                    <span className='her-name-span' > {herName.charAt(0).toUpperCase() + herName.slice(1).toLowerCase()} </span>
                                    will you go on a date with me ? </p>
                                <div className='cupid-images-div' >
                                    <img className='cupid-images' src={handleImageChange(timesHovered)} alt='cupid-image' />
                                </div>
                            </div>

                            {/* <button onClick={() => [setLandingPage(true), setDateAskingPage(false)]} style={{ position: "absolute", top: "100px", left: "700px" }} > back </button> */}

                            <Row gutter={[16, 16]} >
                                <Col span={12} >
                                    <Button className='yes-btn' onClick={() => { setDateAskingPage(false); }}
                                        style={{ transform: `scale(${1 + timesHovered / 20})`, transition: "transform 0.2s ease" }}
                                    >
                                        Yes
                                    </Button>
                                </Col>
                                <Col span={12} >
                                    <Button className='no-btn' onMouseOver={() => { moveBtn(); countHover(); }}> No </Button>
                                </Col>
                            </Row>

                            <Modal
                                footer={null}
                                open={open20TimesModal}
                                onCancel={() => [setOpen20TimesModal(false), setTimesHovered(0)]}
                                className='do-you-really-love-me-modal'
                                title="Important Survey 💌"
                            >
                                <h2 className='do-you-wanna-go-out-with-me-text' >Do you wanna go out with me ?</h2>
                                <div style={{ display: "flex", justifyContent: "end", gap: "10px", marginTop: "20px" }}>
                                    <Button className='date-ask-modal-no-btn' onClick={handle20TimesModalCancel}  >
                                        Hmm... No..!
                                    </Button>

                                    <Button className='date-ask-modal-yes-btn'
                                        onClick={() => { setDateAskingPage(false); setOpen20TimesModal(false); }}
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
                            {/* <Button onClick={() => setLandingPage(true)}>Back</Button> */}
                        </div>
                        <Row className='photo-calendar-row'>
                            <Col sm={24} md={24} lg={18} xl={15} xxl={15} >
                                <img className='calendar-date-image' src='/images/calendar-date-image.png' alt='calendar-date-image' />
                            </Col>
                            <Col sm={24} md={24} lg={8} xl={5} xxl={5} style={{ display: "flex", flexDirection: "column", margin: "0 auto", alignItems: "center", }} >

                                <p className='calendar-text' >When can i take this beauty out?</p>
                                <div style={{ width: 300, borderRadius: "20px", }}>
                                    <Calendar className='date-calendar' fullscreen={false} onPanelChange={onPanelChange} onSelect={onDateSelect} />
                                </div>

                                <Button className='calendar-page-btn' onClick={() => {
                                    if (!selectedDate) {
                                        messageApi.open({
                                            type: "error",
                                            content: "The stars can’t align until you choose a day!",
                                            icon: <span style={{ fontSize: "18px" }}>✨</span>,
                                            style: { marginTop: "5vh" },
                                            className: "calendar-page-btn-alert-message",
                                            duration: 100
                                        });
                                        return;
                                    }
                                    openModal();
                                }}>
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
                                    padding: "6px 11px 8px 16px",
                                    fontFamily: "Signatra",
                                    fontSize: "1.5rem",
                                    marginTop: "-1px"
                                },
                            }}
                            cancelButtonProps={{
                                style: {
                                    backgroundColor: "white",
                                    borderColor: "#ff5a76",
                                    color: "#ff5a76",
                                    padding: "8px 16px 7px",
                                    borderRadius: "20px",
                                    marginTop: "1px"
                                },
                            }}
                            modalRender={(modal) => (
                                <div style={{ borderRadius: "20px" }}>
                                    {modal}
                                </div>
                            )}
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
        </div >
    );
};

export default DateGame;
