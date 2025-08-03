import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { google } from 'npm:googleapis@131.0.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { counselorName, counselorEmail, patientName, patientEmail, dateTime } = await req.json();

    // Initialize Google Calendar API
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: Deno.env.get('GOOGLE_CLIENT_EMAIL'),
        private_key: Deno.env.get('GOOGLE_PRIVATE_KEY')?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });

    const calendar = google.calendar({ version: 'v3', auth });

    // Create Google Meet conference
    const event = {
      summary: `Mental Health Session with ${counselorName}`,
      description: `Counseling session between ${counselorName} and ${patientName}`,
      start: {
        dateTime: dateTime,
        timeZone: 'UTC',
      },
      end: {
        dateTime: new Date(new Date(dateTime).getTime() + 60 * 60 * 1000).toISOString(), // 1 hour session
        timeZone: 'UTC',
      },
      attendees: [
        { email: counselorEmail },
        { email: patientEmail },
      ],
      conferenceData: {
        createRequest: {
          requestId: crypto.randomUUID(),
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      },
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      conferenceDataVersion: 1,
      requestBody: event,
    });

    return new Response(
      JSON.stringify({
        success: true,
        meetLink: response.data.hangoutLink,
        eventId: response.data.id,
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error scheduling session:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});