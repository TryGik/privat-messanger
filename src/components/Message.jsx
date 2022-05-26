import React from 'react';
import Moment from 'react-moment';

const Message = ({ message, user1 }) => {
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