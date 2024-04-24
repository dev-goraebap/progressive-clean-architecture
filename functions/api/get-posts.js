export async function onRequestGet(ctx) {
    const data = await ctx.env.DB.prepare(`select * from posts`).all();
    return Response.json(data);
}