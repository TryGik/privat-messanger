import React from 'react';
import Moment from 'react-moment';
//npm i moment react-moment
const Message = ({ message, user1 }) => {
    //useRef use for scroll that it auto go down when you write a msg
    const scrollRef = React.useRef();

    React.useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [message])
    return (
        <div ref={scrollRef}
            className={`message_wrapper ${message.from === user1 ? 'own' : ''}`}>
            <p className={message.from === user1 ? 'me' : 'friend'}>
                {message.media ? <img src={message.media} alt={message.text} /> : null}
                {message.text}
                <br />
                <small>
                    <Moment fromNow>{message.createdAt.toDate()}</Moment>
                </small>
            </p>
        </div>
    )
}

export default Message;