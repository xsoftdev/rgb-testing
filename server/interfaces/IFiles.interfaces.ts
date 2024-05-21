import {Schema} from 'mongoose'

export interface IFile {
    fileName: string,
    countPages: number,
    fileSizeBytes: number,
    fileFormat: string,
    url: string,
    authorID: Schema.Types.ObjectId
}