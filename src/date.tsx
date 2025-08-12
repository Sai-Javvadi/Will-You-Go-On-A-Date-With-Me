// import React, { useState } from 'react';
// import './date.css';
// import dayjs from 'dayjs';
// import type { Dayjs } from 'dayjs';
// import dayLocaleData from 'dayjs/plugin/localeData';
// import { Button, Col, Row, Calendar, theme } from 'antd';

// const DateGame = () => {
//     const [mainDiv, setMainDiv] = useState<boolean>(true)
//     const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

//     dayjs.extend(dayLocaleData);

//     const moveBtn = () => {
//         const noBtn = document.getElementsByClassName("no-btn")[0] as HTMLElement;
//         if (!noBtn) return;

//         const maxX = window.innerWidth - noBtn.offsetWidth;
//         const maxY = window.innerHeight - noBtn.offsetHeight;

//         const randomX = Math.random() * maxX;
//         const randomY = Math.random() * maxY;

//         noBtn.style.position = "absolute";
//         noBtn.style.left = randomX + "px";
//         noBtn.style.top = randomY + "px";
//     };

//     const { token } = theme.useToken();

//     const wrapperStyle: React.CSSProperties = {
//         width: 300,
//         border: `1px solid ${token.colorBorderSecondary}`,
//         borderRadius: token.borderRadiusLG,
//     };

//     const onDateSelect = (value: Dayjs) => {
//         setSelectedDate(value);
//         console.log("Date selected:", value.format("DD-MM-YYYY"));
//     };

//     const saveDate = () => {
//         if (!selectedDate) {
//             alert("Please select a date first!");
//             return;
//         }
//         alert(`Yay! Saved the date: ${selectedDate.format("DD-MM-YYYY")}`);
//     };

//     return (

//         <div className='main-div'>
//             {mainDiv === true ?
//                 <>
//                     <div className='text-div'>
//                         Will you go on a date with me? 😊
//                     </div>

//                     <button className='yes-btn' onClick={() => [alert("YAYYYYYYYYYYYYYYYYYYYYYYY"), setMainDiv(false)]} >Yes</button>
//                     <button className='no-btn' onMouseOver={moveBtn}>No</button>
//                 </>
//                 :
//                 <>
//                     <div>
//                         <Button onClick={() => setMainDiv(true)} > Back  </Button>
//                     </div>
//                     <Row className='photo-calendar-row' >
//                         <Col span={12} style={{ background: "pink", height: "97%", width: "97%", }} >

//                         </Col>

//                         <Col span={11} style={{ display: "flex", flexDirection: "column", margin: "0 auto", alignItems: "center" }} >
//                             <p>When can i take this beauty out?</p>

//                             <div style={wrapperStyle}>
//                                 <Calendar fullscreen={false} onSelect={onDateSelect} />
//                             </div>
//                             <Button onClick={saveDate} >
//                                 See you soon...
//                             </Button>

//                         </Col>

//                     </Row>
//                 </>
//             }
//         </div>
//     );
// };

// export default DateGame;


import React, { useState } from 'react';
import './date.css';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import dayLocaleData from 'dayjs/plugin/localeData';
import { Button, Col, Row, Calendar, Modal, Input, theme } from 'antd';
import type { CalendarProps } from 'antd';
import emailjs from 'emailjs-com';

const DateGame = () => {
    const [mainDiv, setMainDiv] = useState(true);
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [recipientEmails, setRecipientEmails] = useState("");
    const [yourEmail, setYourEmail] = useState("");
    const [specialEmail, setSpecialEmail] = useState("")

    dayjs.extend(dayLocaleData);
    const { token } = theme.useToken();

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

        const maxX = window.innerWidth - noBtn.offsetWidth;
        const maxY = window.innerHeight - noBtn.offsetHeight;

        const randomX = Math.random() * maxX;
        const randomY = Math.random() * maxY;

        noBtn.style.position = "absolute";
        noBtn.style.left = randomX + "px";
        noBtn.style.top = randomY + "px";
    };

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

        const toEmails = [yourEmail, specialEmail].join(", "); // both recipients

        const templateParams = {
            date: selectedDate?.format("DD-MM-YYYY"),
            to_email: toEmails,
            // message: message,
            from_name: "Your Special One",
        };

        emailjs.send(
            "service_will-u-g-t-d-w-m",   // Replace with your EmailJS service ID
            "template_date_temp",         // Replace with your EmailJS template ID
            // {
            //     date: selectedDate?.format("DD-MM-YYYY"),
            //     to_email: recipientEmails, // multiple emails, comma-separated
            // },
            templateParams,
            "6G8dbqk7TIjwFrSX8"            // Replace with your EmailJS public key
        ).then(() => {
            alert("💌 Email sent successfully to: " + recipientEmails);
            setIsModalOpen(false);
            setRecipientEmails("");
        }).catch((err) => {
            alert("Failed to send email: " + err.text);
        });
    };

    const wrapperStyle: React.CSSProperties = {
        width: 300,
        border: `1px solid ${token.colorBorderSecondary}`,
        borderRadius: token.borderRadiusLG,
    };

    return (
        <div className='main-div'>
            {mainDiv ? (
                <>
                    <div className='text-div'>
                        Will you go on a date with me? 😊
                    </div>
                    <button
                        className='yes-btn'
                        onClick={() => {
                            alert("YAYYYYYYYYYYYYYYYYYYYYYYY");
                            setMainDiv(false);
                        }}
                    >
                        Yes
                    </button>
                    <button className='no-btn' onMouseOver={moveBtn}>
                        No
                    </button>
                </>
            ) : (
                <>
                    <div>
                        <Button onClick={() => setMainDiv(true)}>Back</Button>
                    </div>
                    <Row className='photo-calendar-row'>
                        <Col span={12} style={{ background: "pink", height: "97%", width: "97%" }}></Col>
                        <Col
                            span={11}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                margin: "0 auto",
                                alignItems: "center",
                            }}
                        >
                            <p>When can I take this beauty out?</p>

                            <div style={wrapperStyle}>
                                <Calendar
                                    fullscreen={false}
                                    onPanelChange={onPanelChange}
                                    onSelect={onDateSelect}
                                />
                            </div>

                            <Button style={{ marginTop: "10px" }} onClick={openModal}>
                                Save the date 💖
                            </Button>
                        </Col>
                    </Row>

                    {/* Modal for entering recipient emails */}
                    {/* <Modal
                        title="Enter Recipient Emails"
                        open={isModalOpen}
                        onCancel={() => setIsModalOpen(false)}
                        onOk={handleSendEmail}
                        okText="Send Email 💌"
                        modalRender={((modal) => (
                            <div style={{ width: "500px" }} >
                                {modal}
                            </div>
                        ))}
                    >
                        <Input
                            type="text"
                            placeholder="Enter emails separated by commas (e.g. you@example.com, love@example.com)"
                            value={recipientEmails}
                            onChange={(e) => setRecipientEmails(e.target.value)}
                        />
                        <p style={{ color: "#777", fontSize: "10px", marginTop: "8px" }}>
                            This special invitation is sent with love by <b>Sai Javvadi</b> 💌
                        </p>
                    </Modal> */}

                    <Modal
                        title="Send Email"
                        open={isModalOpen}
                        onCancel={() => setIsModalOpen(false)}
                        onOk={handleSendEmail}
                        okText="Send Email 💌"
                    >
                        <label>Your Email:</label>
                        <Input
                            placeholder="Enter your email"
                            value={yourEmail}
                            onChange={(e) => setYourEmail(e.target.value)}
                            style={{ marginBottom: "10px" }}
                        />

                        <label>Special Person's Email:</label>
                        <Input
                            placeholder="Enter their email"
                            value={specialEmail}
                            onChange={(e) => setSpecialEmail(e.target.value)}
                            style={{ marginBottom: "10px" }}
                        />
                        <p style={{ color: "#777", fontSize: "10px", marginTop: "8px" }}>
                            This special invitation is sent with love by <b>Sai Javvadi</b> 💌
                        </p>

                        {/* <label>Message:</label> */}
                        {/* <textarea
                            style={{ width: "100%", minHeight: "80px" }}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        /> */}
                    </Modal>
                </>
            )}
        </div>
    );
};

export default DateGame;
