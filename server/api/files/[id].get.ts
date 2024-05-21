import File from "./models/file.model";

interface EventContext {
  params?: {
    id?: string;
  };
}

export default defineEventHandler(async (event: { context: EventContext }) => {
  try {
    const id = event.context.params!.id;
    const item = await File.findById(id).populate('authorID');
    return {
      status: 200,
      message: item,
      ok: true,
    };
  } catch (error) {
    return {
      status: 500,
      message: error,
      ok: false,
    };
  }
});