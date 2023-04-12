import React, { useEffect } from 'react';
import useState from 'react-usestateref';
import axios from 'axios';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const API_BASE = "http://localhost:3500";

function Home() {
    const [flag, setFlag] = useState(true);
    function LogoutUser() {
        window.localStorage.setItem("user", '{}');
        axios.post(API_BASE + '/auth/logout').then(res => alert(res.data.message));
        window.location.reload();
    }

    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [date, setDate] = useState('');
    const [seat, setSeat, seatRef] = useState(0);
    const [schedid, setSchedId, schedIDref] = useState('');
    const [busSchedule, SetBusschedule] = useState(<></>);
    const [myBookings, SetMyBookings] = useState(<></>);

    useEffect(() => {
        console.log(from); console.log(to); console.log(date); console.log(seat); console.log(schedid);
    }, []);

    const handleChangeFrom = event => {
        setFrom(event.target.value);
    };

    const handleChangeTo = event => {
        setTo(event.target.value);
    };

    const handleChangeDate = event => {
        setDate(event.target.value);
    };

    const handleChangeSeat = event => {
        setSeat(event.target.value);
    };

    function callBackendForSched() {
        setFlag(true);
        axios.put(API_BASE + "/sched/getBuses", { from, to, date })
            .then(async response => {
                const { data } = response;
                console.log(response.data);
                const tabledata = data.map((obj) =>
                    <>
                        <div className='schedbox'>{obj.id}</div>
                        <div className='schedbox'>{obj.busNumber}</div>
                        <div className='schedbox'>{obj.time}</div>
                        <div className='schedbox'>&#x20b9; {obj.pricePerSeat}</div>
                        <div className='schedbox'>
                            <Button variant="primary" onClick={() => { handleShow(); setSchedId(obj.id) }}>
                                Select
                            </Button>
                        </div>
                    </>
                );

                SetBusschedule(
                    <div className="schedTable">
                        <div className="busnocol">Schedule ID</div>
                        <div className="schedidcol">Bus No.</div>
                        <div className="depttimecol">Time of Departure</div>
                        <div className="pricecol">Price/seat</div>
                        <div className="selectcol"> </div>
                        {tabledata}
                    </div>
                );

            })

    }

    function askForBooking() {
        const schedId = schedIDref.current;
        axios.put(API_BASE + "/booking/getBookedSeats", { schedId })
            .then(async response => {
                const { data } = response;
                const seatno = seatRef.current;
                if (seatno <= 0) {
                    alert('Please enter valid input')
                }
                else if (seatno <= (data.capacity - data.booked)) {
                    Book(schedId);
                }
                else {
                    alert('Total seats:' + data.capacity + '\nBooked seats:' + data.booked + '\nNot enough seats available, booking Failed!');
                }
            })
    }

    function Book(schedId) {
        const noOfSeats = seatRef.current;
        fetch(API_BASE + "/booking", {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                schedId,
                seats: noOfSeats,
                id: JSON.parse(window.localStorage.getItem('user')).id
            })
        }).then(async response => {
            var res = await response.json();
            alert(res.message);
        })
    }

    function getBookings() {
        setFlag(false);
        axios.put(API_BASE + "/booking/getMyBookings", JSON.parse(window.localStorage.getItem('user')))
            .then(async response => {
                const { data } = response;
                console.log(data);
                const tabledata = data.map((obj) =>
                    <>
                        <div className='schedbox'>{obj.date.slice(0, -14)}</div>
                        <div className='schedbox'>{obj.busNumber}</div>
                        <div className='schedbox'>{obj.fromm}</div>
                        <div className='schedbox'>{obj.too}</div>
                        <div className='schedbox'>{obj.time}</div>
                        <div className='schedbox'>{obj.seatsBooked}</div>
                        <div className='schedbox'>{obj.cost}</div>
                    </>
                );
                SetMyBookings(
                    <div className="bookingsTable">
                        <div className="bdate">Date</div>
                        <div className="bbusnum">Bus No.</div>
                        <div className="bfrom">From</div>
                        <div className="bto">To</div>
                        <div className="btime">Time</div>
                        <div className="bnoofseats">no. of seats</div>
                        <div className="bprice">price</div>
                        {tabledata}
                    </div>
                );
            })
    }

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <div>
            <div className='navbtns'>
                <Button className="bookingsbutton" onClick={getBookings} >My Bookings</Button>
                <Button className="logoutbutton" onClick={LogoutUser} >Logout</Button>
            </div>
            <div className="homeInputs">
                <label htmlFor="from">From: </label>
                <input type="text" name="from" onChange={handleChangeFrom} id="" />
            </div>

            <div className="homeInputs">
                <label htmlFor="to">To: </label>
                <input type="text" name="to" onChange={handleChangeTo} id="" />
            </div>

            <div className="homeInputs">
                <label htmlFor="date">Date: </label>
                <input type="date" name="date" onChange={handleChangeDate} id="" />
            </div>

            <Button className='GoButton' onClick={callBackendForSched}>Go</Button>

            {flag && busSchedule}
            {!flag && myBookings}

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body>
                    <div className="seatNoInput">
                        <label htmlFor="seatno">Enter no. of seats to be booked: </label>
                        <input type="number" name="seatno" onChange={handleChangeSeat} />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => { askForBooking(); handleClose() }}>
                        Book Now
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>
    )
}

export default Home;