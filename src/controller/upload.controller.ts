import { Request, Response } from "express";
import { HttpHelper } from "../helpers/http.helper";
import * as XLSX from 'xlsx';
import { IKata, Kata } from "../db/models/kata.model";
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { EntryDto, KataDto } from "../db/dtos/kata.dto";
import { Ientry } from "../db/models/entry.model";


export class UploadController {
    static uploadImageCtrl(req: Request, res: Response) {
        if (!req.file) {

            return HttpHelper.handleUserError({}, 'No File Uploaded', res)
        }

        const data = {
            message: "File uploaded successfully",
            filename: req.file.filename,
            path: `/uploads/${req.file.filename}`
        }

        HttpHelper.handleResponse(data, res);


    }

    static async uploadKataExcel(req: Request, res: Response) {
       
        if (!req.file) {

            return HttpHelper.handleUserError({}, 'No File Uploaded', res)
        }
        console.log("the file is", req.file);

        try {
            const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
      
            const rows: any[] = XLSX.utils.sheet_to_json(sheet, { defval: '' });
      
            const validated: IKata[] = [];
      
            for (const row of rows) {
                const instance = plainToInstance(KataDto, {
                  ...row
                });
        
                const errors = await validate(instance);
                if (errors.length > 0) {
                  return HttpHelper.handleUserError(
                    errors.map((e) => ({
                      property: e.property,
                      constraints: e.constraints,
                    })),
                    'Validation Failed',
                    res
                  );
                }
        
                validated.push(instance);
              }
             const resp = await Kata.bulkCreate(validated.map(instance => ({ ...instance })))
              return HttpHelper.handleResponse( resp , res);
          } catch (error) {
            return HttpHelper.handleServerError(error, res);
          }

    }

    static async uploadEntryExcel(req: Request, res: Response) {
      if (!req.file) {

        return HttpHelper.handleUserError({}, 'No File Uploaded', res)
    }
    console.log("the file is", req.file);

    try {
        const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
  
        const rows: any[] = XLSX.utils.sheet_to_json(sheet, { defval: '' });
  
        const validated: Ientry[] = [];
  
        for (const row of rows) {
            const instance = plainToInstance(EntryDto, {
              ...row
            });
    
            const errors = await validate(instance);
            if (errors.length > 0) {
              return HttpHelper.handleUserError(
                errors.map((e) => ({
                  property: e.property,
                  constraints: e.constraints,
                })),
                'Validation Failed',
                res
              );
            }
    
            validated.push(instance);
          }
          
         const resp = validated.map(instance => ({ ...instance }));
          return HttpHelper.handleResponse( resp , res);
      } catch (error) {
        return HttpHelper.handleServerError(error, res);
      }
      }
}