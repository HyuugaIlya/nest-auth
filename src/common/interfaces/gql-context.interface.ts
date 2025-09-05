import type { Request, Response } from "express";

export class GqlContext {
    req: Request
    res: Response
}