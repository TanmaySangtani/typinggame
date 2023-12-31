import React, {useRef, useState} from 'react'
import copy from "copy-to-clipboard"

const DisplayGameCode = ({gameID}) => {

    const [copySuccess, setCopySuccess] = useState(false)
    const textInputRef = useRef(null)

    const copyToClipboard = (e) => {
        textInputRef.current.select()
        copy(gameID)
        setCopySuccess(true)
    }

  return (
    <>
        <div className="row my-3 text-center">
            <div className="col-sm"></div>
            <div className="col-sm-8">
                <h4>Send this code to your friends to join</h4>
                <div className="input-group mb-3">
                    <input type="text" ref={textInputRef} value={gameID} readOnly className="form-control"/>
                    <div className="input-group-append">
                        <button className="btn btn-outline-secondary" onClick={copyToClipboard} type="button">Copy Game Code</button>
                    </div>
                </div>
                {copySuccess && <div className="alert alert-success" role="alert">Successfully Copied Game Code</div>}
            </div>
            <div className="col-sm"></div>
        </div>
    </>
  )
}

export default DisplayGameCode
