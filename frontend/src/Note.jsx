import { useEffect, useState } from "react"
import { Button, Form, Modal, Container } from "react-bootstrap"
import { useParams } from "react-router-dom"

export const Note = () => {
  const [note, setNote] = useState("")
  const [password, setPassword] = useState("")
  const [showModal, setShowModal] = useState(true)
  const [titleAvailable, setTitleAvailable] = useState(true)
  const [error, setError] = useState('')
  const { noteTitle: title } = useParams()

  const createNote = async (e) => {
    e.preventDefault()

    fetch('http://localhost:3000/note', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ title, note, password })
    })
  }

  const getNote = async (e) => {
    e?.preventDefault()

    const res = await fetch(`http://localhost:3000/note/${title}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ password })
    })

    if (res.ok) {
      const noteData = await res.json()
      setNote(noteData.note)
      setShowModal(false)
    }

    if (res.status == 403) {
      setError('password is incorrect')
    }

    return res.ok
  }

  const checkTitleAvailable = async () => {
    return (await fetch(`http://localhost:3000/note-status/${title}`)).ok
  }

  useEffect(() => {
    checkTitleAvailable().then((status) => setTitleAvailable(status))
  }, [])

  return (
    <Container>
      <header className="my-4 d-flex justify-content-between">
        <h1 className="fs-4">🔐 Protected Text</h1>
      </header>
      <main>
        <>
          <Modal show={showModal} size="sm">
            <form onSubmit={getNote}>
              {titleAvailable ?
                <>
                  <Modal.Header>
                    <Modal.Title>Create new site? {title}</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <p>Great! This site doesn&apos;t exist, it can be yours!</p>
                    <Form.Label htmlFor="password">New password</Form.Label>
                    <Form.Control
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      name="password"
                      id="passowrd"
                    />
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setShowModal(false)}
                    >
                      Create
                    </Button>
                  </Modal.Footer>
                </> : (<>
                  <Modal.Header>
                    <Modal.Title>Password required</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <p>This site (this url), is already occupied</p>
                    <Form.Label htmlFor="password">Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      name="password"
                      id="passowrd"
                    />
                  </Modal.Body>
                  <Modal.Footer>
                    <p>{error}</p>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={getNote}
                    >
                      Check
                    </Button>
                  </Modal.Footer>
                </>
                )}
            </form>
          </Modal>
          <form onSubmit={createNote}>
            <Form.Control
              value={note}
              onChange={(e) => setNote(e.target.value)}
              name="note"
              as="textarea"
              id="note"
              cols="30"
              rows="10"
              placeholder="Your text goes here..."
            />
            <Button className="mt-2 d-block ms-auto" type="submit">
              Save
            </Button>
          </form>
        </>
      </main>
    </Container>
  )
}
