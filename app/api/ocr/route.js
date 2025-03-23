import axios from 'axios';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { imageUrl } = body;
    console.log('Received Cloudinary imageUrl:', imageUrl);

    if (!imageUrl) {
      return NextResponse.json({ success: false, error: 'Missing image URL' }, { status: 400 });
    }

    const apiKey = process.env.AIXPLAIN_API_KEY || process.env.TEAM_API_KEY;
    if (!apiKey) {
      console.error('Missing AIXplain API key in environment variables');
      return NextResponse.json({ success: false, error: 'Server configuration error: Missing API key' }, { status: 500 });
    }

    const response = await axios.post(
      'https://platform-api.aixplain.com/assets/pipeline/execution/run/67d2b09d8e9326b58bc20868',
      { "Input 1": imageUrl },
      { headers: { 'x-api-key': apiKey } }
    );

    console.log('Initial OCR API Response:', response.data);

    const requestId = response.data.url?.split('/').pop();
    if (!requestId) {
      throw new Error('Failed to extract request ID from OCR API response');
    }
    console.log('AIxplain OCR Request ID:', requestId);

    let status = 'IN_PROGRESS';
    let ocrText = null;
    let attempts = 0;
    const maxAttempts = 60;
    const pollingInterval = 2000;

    while (status === 'IN_PROGRESS' && attempts < maxAttempts) {
      attempts++;
      await new Promise(resolve => setTimeout(resolve, pollingInterval));
      const statusResponse = await axios.get(
        `https://platform-api.aixplain.com/assets/pipeline/execution/check/${requestId}`,
        { headers: { 'x-api-key': apiKey } }
      );

      console.log(`Attempt ${attempts}:`, statusResponse.data);

      status = statusResponse.data.status;
      if (status === 'SUCCESS') {
        console.log('OCR processing successful. Response data:', statusResponse.data);
        const contentUrl = statusResponse.data.data?.[0]?.segments?.[0]?.response;
        console.log('OCR Content URL:', contentUrl);
        if (!contentUrl) {
          throw new Error('OCR completed, but no content URL found in response');
        }
        const contentResponse = await axios.get(contentUrl);
        ocrText = contentResponse.data;
        console.log('OCR Text Retrieved:', ocrText);
      } else if (status === 'failed') {
        throw new Error('OCR processing failed on AIxplain server');
      }
    }

    if (ocrText) {
      return NextResponse.json({ success: true, text: ocrText });
    } else {
      throw new Error(`Failed to retrieve OCR text after ${attempts} attempts. Final status: ${status}`);
    }
  } catch (error) {
    console.error('OCR error:', error);
    let errorMessage = error.message;
    if (error.response) {
      errorMessage = `AIxplain API error - Status ${error.response.status}: ${error.response.data?.message || error.message}`;
    }
    return NextResponse.json({
      success: false,
      error: errorMessage,
      details: error.response?.data || 'No additional details available'
    }, { status: 500 });
  }
}