import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles

const Email = () => {
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [rawHtml, setRawHtml] = useState('');

  const handleSendEmail = () => {
    // Logic to send email
    console.log('Email sent to:', recipient);
    console.log('Subject:', subject);
    console.log('Message:', message);
    console.log('Raw HTML Message:', rawHtml);
  };

  const styles = {
    container: {
      margin: '0 auto',
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '5px',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    },
    label: {
      display: 'block',
      marginBottom: '5px',
      fontWeight: 'bold',
    },
    input: {
      width: '100%',
      padding: '8px',
      marginBottom: '10px',
      border: '1px solid #ccc',
      borderRadius: '4px',
    },
    textarea: {
      width: '100%',
      padding: '8px',
      marginBottom: '10px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      minHeight: '100px',
    },
    button: {
      padding: '10px 15px',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      marginTop: '10px',
    },
    buttonHover: {
      backgroundColor: '#0056b3',
    },
    preview: {
      marginTop: '20px',
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '5px',
      backgroundColor: '#f9f9f9',
    },
  };

  const defaultEmailTemplate = '';

  return (
    <div style={styles.container}>
      <h1>Send Email</h1>
      <div>
        <label style={styles.label}>Recipient:</label>
        <input 
          type="email" 
          value={recipient} 
          onChange={(e) => setRecipient(e.target.value)} 
          placeholder="Enter recipient email" 
          style={styles.input}
        />
      </div>
      <div>
        <label style={styles.label}>Subject:</label>
        <input 
          type="text" 
          value={subject} 
          onChange={(e) => setSubject(e.target.value)} 
          placeholder="Enter email subject" 
          style={styles.input}
        />
      </div>
      <div>
        <label style={styles.label}>Message (Rich Text):</label>
        <ReactQuill 
          value={message} 
          onChange={setMessage} 
          placeholder="Write your message here..."
          modules={{
            toolbar: [
              [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
              [{size: []}],
              ['bold', 'italic', 'underline', 'strike', 'blockquote'],
              [{'list': 'ordered'}, {'list': 'bullet'}, 
               {'indent': '-1'}, {'indent': '+1'}],
              ['link', 'image', 'video'],
              ['clean']                                         
            ],
          }}
        />
      </div>
      <div>
        <label style={styles.label}>Message (Raw HTML):</label>
        <textarea
          value={rawHtml}
          onChange={(e) => setRawHtml(e.target.value)}
          placeholder="Enter raw HTML here"
          style={styles.textarea}
        />
      </div>
      <button 
        style={styles.button}
        onMouseOver={(e) => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
        onMouseOut={(e) => e.target.style.backgroundColor = styles.button.backgroundColor}
        onClick={handleSendEmail}
      >
        Send Email
      </button>
      <div style={styles.preview}>
        <h2>Message Preview:</h2>
        <div dangerouslySetInnerHTML={{ __html: rawHtml || defaultEmailTemplate }} />
      </div>
    </div>
  );
};

export default Email;
