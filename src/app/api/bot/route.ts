export async function POST(request: Request) {
  const body: { message: string } = await request.json();
  try {
    const result = await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_API_TOKEN}/sendMessage?chat_id=${process.env.TELEGRAM_GROUP_CHAT_ID}&text=${body.message}`,
      { method: 'POST' }
    );
    return new Response(`{ message: 'success'}`, { status: 200 });
  } catch (err) {
    return new Response(`{ message: 'error'}`, { status: 500 });
  }
}
