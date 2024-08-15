import { createObjectCsvWriter } from 'csv-writer';
import { fileURLToPath } from 'url';
import csv from 'csv-parser';
import path from 'path';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default class CSVManager {
    constructor(filePath) {
        this.filePath = filePath;
        this.headers = [{ id: 'id', title: 'id' }, { id: 'data', title: 'data' }];
        this.createFileIfNotExists();
    }

    async createFileIfNotExists() {
        try {
            if (!fs.existsSync(this.filePath)) {
                const csvWriter = createObjectCsvWriter({
                    path: this.filePath,
                    header: this.headers
                });
                await csvWriter.writeRecords([]);
            }
        } catch (error) {
            console.error('Error creating file:', error);
        }
    }

    async readAll() {
        const results = [];
        return new Promise((resolve, reject) => {
            fs.createReadStream(this.filePath)
                .pipe(csv())
                .on('data', (row) => {
                    if (Object.keys(row).length) {
                        results.push(row);
                    }
                })
                .on('end', () => resolve(results))
                .on('error', (error) => reject(error));
        });
    }

    async createOrUpdate(record) {
        let records = await this.readAll();
        const index = records.findIndex(r => r.id === record.id);

        if (index !== -1) {
            records[index] = record;
        } else {
            records.push(record);
        }

        await this.writeRecords(records);
    }

    async delete(id) {
        let records = await this.readAll();
        records = records.filter(record => record.id !== id);
        await this.writeRecords(records);
    }

    async writeRecords(records) {
        const csvWriter = createObjectCsvWriter({
            path: this.filePath,
            header: this.headers
        });

        records = records.filter(record => record.id && record.data);

        await csvWriter.writeRecords(records);
    }
}