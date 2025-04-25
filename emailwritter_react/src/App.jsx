import { Container, Typography, Box, TextField, FormControl, InputLabel, Select, MenuItem, CircularProgress, Button} from '@mui/material'
import { useState } from 'react';
import axios from 'axios';

import './App.css'

function App() {
  const [emailContent, setEmailContent] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generateReply, setGenerateReply] = useState(false);
  const [tone, setTone] = useState('');
  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try{
      const response = await axios.post('http://localhost:8080/api/email/generate', {
        emailContent,
        tone
      })
      setGenerateReply(typeof response.data === 'string' ? response.data : JSON.stringify(response.data));
    }
    catch(error) {
      setError('An error occurred while generating the reply.');
      console.error(error);
    }finally{
      setLoading(false);
    }
  };


  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Email Reply Generator
      </Typography>
      <Box sx={{ mx: 3 }}>
        <TextField
          fullWidth
          multiline
          rows={6}
          label="Original Email Content"
          value={emailContent}
          onChange={(e) => setEmailContent(e.target.value)}
          sx={{ mb: 2 }}
        />
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="tone-label">Tone (Optional)</InputLabel>
          <Select
            labelId="tone-label"
            value={tone}
            label="Tone (Optional)"
            onChange={(e) => setTone(e.target.value)}
          >
            <MenuItem value="Formal">Formal</MenuItem>
            <MenuItem value="Professional">Professional</MenuItem>
            <MenuItem value="Casual">Casual</MenuItem>
            <MenuItem value="Friendly">Friendly</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!emailContent || loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Generate Reply'}
        </Button>
      </Box>
      {error && (
        <Typography color = 'error' sx = {{ mb: 2 }}>
            {error}
        </Typography>
      )}
      {generateReply && (
        <Box sx={{ mx: 3, mt: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Generated Reply
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={6}
            variant = "outlined"
            value={generateReply || ''}
            inputProps={{ readOnly: true }}/>
          <Button
            variant="outlined"
            onClick={() => { navigator.clipboard.writeText(generateReply); alert('Reply copied to clipboard!'); }}
            sx={{ mt: 2, mr: 2 }}
          >
            Copy to clipboard
          </Button>
        </Box>
      )}
    </Container>
  );
}


export default App
