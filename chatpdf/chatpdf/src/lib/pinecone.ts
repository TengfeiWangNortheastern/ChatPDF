import { PineconeClient } from '@pinecone-database/pinecone';
import { downloadFromS3 } from './s3-server';
import {PDFLoader} from 'langchain/document_loaders/fs/pdf'

let pinecone:PineconeClient | null = null;

export const getPinecone = async () => {
    if(!pinecone){
        pinecone = new PineconeClient()
            await pinecone.init({
                environment: process.env.PINECONE_ENVIRONMENT!,
                apiKey: process.env.PINECONE_API_KEY!
            });
        }
    
    return pinecone
}

export async function loadS3IntoPinecone(fileKey:string) {
    //1. obtain the pdf -> download and read from pdf
    console.log('downloading s3 into file system...');
    const file_name = await downloadFromS3(fileKey);
    if(!file_name){
        throw new Error('file not found from s3');
    }
    const loader = new PDFLoader(file_name);
    const pages = loader.load();
    console.log();
    return pages;
}