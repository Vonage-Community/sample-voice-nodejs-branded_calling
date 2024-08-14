import { vcr } from '@vonage/vcr-sdk';

import CSVManager from './csvManager.js';
import { findObjectWithValue } from './helpers.js';

async function getBrand(key) {
    let brands = await getBrands()
    const brandObj = findObjectWithValue(brands, key);
    return brandObj
}

async function getBrands() {
    let brands;

    if (process.env.VCR === 'true') {
        const state = vcr.getInstanceState();
        const brandData = await state.mapGetValues('brands');
        brands = brandData.map(JSON.parse)
    } else {
        const manager = new CSVManager('./data.csv');
        const brandData = await manager.readAll();
        brands = brandData.map(item => {
            return JSON.parse(item.data);
        });
    }
    return brands
}

async function createBrand(brand) {
    const number = brand.number;
    if (process.env.VCR === 'true') {
        const state = vcr.getInstanceState();
        await state.mapSet('brands', { [number]: JSON.stringify(brand) });
    } else {
        const manager = new CSVManager('./data.csv');
        await manager.createOrUpdate({ id: number, data: JSON.stringify(brand) });
    }
}

async function deleteBrand(number) {
    if (process.env.VCR === 'true') {
        const state = vcr.getInstanceState();
        await state.mapDelete('brands', [number])
    } else {
        const manager = new CSVManager('./data.csv');
        await manager.delete(number);
    }
}

export {
    getBrand,
    getBrands,
    createBrand,
    deleteBrand
};