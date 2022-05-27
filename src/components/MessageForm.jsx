import React from 'react';
import Attachment from './svg/Attachment';
//
import Picker from 'emoji-picker-react';

const MessageForm = ({ handleSubmit, text, setText, setImg, img }) => {

    const [showPicker, setShowPicker] = React.useState(false);
    const onEmojiClick = (event, emojiObject) => {
        setText(prevInput => prevInput + emojiObject.emoji);
        setShowPicker(false);
    };

    const error = (e) => {
        e.preventDefault()
        alert('Напишите ,что нибудь:)Ну же!')
    }

    return (
        <form className='message_form' onSubmit={text || img ? handleSubmit : error}>
            <label htmlFor="img">
                <Attachment />
            </label>
            <svg
                style={{ width: '25px', height: '25px', cursor: 'pointer', position: 'relative', transform: 'translateY(-4px)' }}
                onClick={() => setShowPicker(val => !val)}
                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z" clipRule="evenodd" />
            </svg>
            {showPicker && <Picker
                groupVisibility={{
                    animals_nature: false,
                    food_drink: false,
                    travel_places: false,
                    activities: false,
                    objects: false,
                    symbols: false,
                    flags: false,
                    recently_used: false
                }}
                pickerStyle={{ width: '100%' }}
                onEmojiClick={onEmojiClick} />}
            <input
                onChange={e => setImg(e.target.files[0])}
                type="file" id="img" accept='image/*' style={{ display: 'none' }} />
            <div>
                <input type="text" placeholder='Введите сообщение'
                    value={text}
                    onChange={e => setText(e.target.value)} />
            </div>
            <div>
                <button className={`btn ${text || img ? '' : 'disabled'} `}  >Отправить</button>
            </div>
        </form>
    )
}

export default MessageForm; 