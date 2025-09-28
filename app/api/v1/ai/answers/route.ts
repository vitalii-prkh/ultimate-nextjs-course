import {NextResponse} from "next/server";
import {openai} from "@ai-sdk/openai";
import {generateText} from "ai";
import {z} from "zod";
import {handleError} from "@/lib/handlers/error";
import {schemaAIAnswer} from "@/lib/validations";
import {ValidationError} from "@/lib/http-errors";

export async function POST(req: Request) {
  const {question, content} = await req.json();

  try {
    const validatedData = schemaAIAnswer.safeParse({question, content});

    if (!validatedData.success) {
      const fieldErrors = z.flattenError(validatedData.error).fieldErrors;

      throw new ValidationError(fieldErrors);
    }

    const {text} = await generateText({
      model: openai("gpt-5"),
      prompt: `Generate markdown-formatted response to the following question: ${question} based on the provided content: ${content}`,
      system:
        "You are a helpful assistant that provides informative responses in markdown format. Use appropriate markdown syntax for headings, lists, code blocks, and emphasis where necessary. For code blocks, use short-form smaller case language identifiers (e.g., 'js' for JavaScript, 'py' for Python, 'ts' for TypeScript, 'html' for HTML, 'css' for CSS, etc.).",
    });

    return NextResponse.json({success: true, data: text}, {status: 200});
  } catch (error) {
    return handleError(error, "api");
  }
}
