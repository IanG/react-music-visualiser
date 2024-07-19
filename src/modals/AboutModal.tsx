import {Button, Modal} from "react-bootstrap";
import BrowserDetails from "../components/BrowserDetails.tsx";

interface AboutModalProps {
    visible: boolean;
    setVisible: (visible: boolean) => void;
}

export default function AboutModal({visible, setVisible}: AboutModalProps) {

    return (
        <Modal show={visible} centered>
            <Modal.Header closeButton onHide={() => setVisible(false)}>
                <Modal.Title>
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-soundwave" viewBox="0 0 18 18">
                        <path fillRule="evenodd" d="M8.5 2a.5.5 0 0 1 .5.5v11a.5.5 0 0 1-1 0v-11a.5.5 0 0 1 .5-.5m-2 2a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5m4 0a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5m-6 1.5A.5.5 0 0 1 5 6v4a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m8 0a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m-10 1A.5.5 0 0 1 3 7v2a.5.5 0 0 1-1 0V7a.5.5 0 0 1 .5-.5m12 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0V7a.5.5 0 0 1 .5-.5"/>
                    </svg>
                    &nbsp;Sound Visualiser
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p><strong>Version: </strong>{" " + APP_VERSION}</p>
                <BrowserDetails/>
                <hr/>
                <p>React experiment using the Javascript Sound API.</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setVisible(false)}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}