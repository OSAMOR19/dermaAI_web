const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// 1. Load env vars
const envPath = path.join(__dirname, '..', '.env.local');
if (!fs.existsSync(envPath)) {
  console.error('.env.local file not found at:', envPath);
  process.exit(1);
}
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    envVars[match[1]] = (match[2] || '').replace(/['"]/g, '').trim();
  }
});

const supabase = createClient(
  envVars.NEXT_PUBLIC_SUPABASE_URL,
  envVars.SUPABASE_SERVICE_ROLE_KEY
);

// List of known brands to extract from product names
const KNOWN_BRANDS = [
  'Skin By Zaron', 'Zaron', 'Good Molecules', 'Cosrx', 'CosRx', 'Isntree', 'Axis-Y', 
  'Beauty Of Joseon', 'Beauty of Joseon', 'The Ordinary', 'Anua', 'Some By Mi', 
  'Heimish', 'Msmetics', 'Dr Jart', 'Topicals', 'Timeless Skin Care', 'Timeless', 
  'Advanced Clinicals', 'Medix 5.5', 'Medix', 'Medi-Peel', 'Balance Active', 
  'Nip + Fab', 'Naturium', 'Panoxyl', 'La Roche-Posay', 'Cerave', 'CeraVe', 
  'Neutrogena', 'Zapzyt', 'Touch', 'Tiam', 'Acwell', 'Skin1004', 'Missha', 
  'Mary & May', 'Dr Althea', 'Jumiso', 'Haruharu Wonder', 'Haruharu', 'Ezanic', 
  'Kojivit', 'E45', 'Simple', 'Bolden'
];

function extractBrand(productName) {
  for (const brand of KNOWN_BRANDS) {
    if (productName.toLowerCase().startsWith(brand.toLowerCase())) {
      return brand;
    }
  }
  // Fallback: take first two words or first word
  const words = productName.split(' ');
  if (words.length > 1) {
    return `${words[0]} ${words[1]}`;
  }
  return words[0] || 'Unknown';
}

async function runMigration() {
  try {
    const filePath = path.join(__dirname, 'all_products.txt');
    if (!fs.existsSync(filePath)) {
      console.error('all_products.txt not found at:', filePath);
      process.exit(1);
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    console.log(`Loaded ${lines.length} lines from all_products.txt`);

    const products = [];
    const categories = [];
    let isCategorySection = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Detect start of categories section
      if (line.includes('tblCategories') || line.includes('Primary Key Reference')) {
        isCategorySection = true;
        console.log(`Found start of Categories section at line ${i + 1}`);
        continue;
      }

      // Skip header lines
      if (line.startsWith('CategoryID (FK)\tCategoryName') || line.startsWith('CategoryID (PK)\tCategoryName')) {
        continue;
      }

      const parts = line.split('\t');

      if (!isCategorySection) {
        // Parse Product
        // CategoryID (FK)	CategoryName	ProductName	SubType	Finish	Best For (Skin Concern)	Confidence	SkinConcernTag	ProductID (PK)	Image 1 (Primary)	Image 2	Image 3
        if (parts.length < 9) continue;
        
        const categoryId = parts[0]?.trim();
        const categoryName = parts[1]?.trim();
        const productName = parts[2]?.trim();
        const subType = parts[3]?.trim() || null;
        const finish = parts[4]?.trim() || null;
        const bestFor = parts[5]?.trim() || null;
        const confidenceLevel = parts[6]?.trim() || 'Medium';
        const skinConcernTagStr = parts[7]?.trim() || '';
        const id = parts[8]?.trim();
        const imageUrl = parts[9]?.trim() || null;
        const imageUrl2 = parts[10]?.trim() || null;
        const imageUrl3 = parts[11]?.trim() || null;

        if (!id || !productName) continue;

        // Skip placeholder rows or totals
        if (id.startsWith('TOTAL') || id.startsWith('ProductID') || id.startsWith('PROD-') === false) {
          continue;
        }

        const skinConcernTags = skinConcernTagStr
          ? skinConcernTagStr.split(',').map(t => t.trim()).filter(Boolean)
          : [];

        const brand = extractBrand(productName);

        products.push({
          id,
          category_id: categoryId,
          category_name: categoryName,
          product_name: productName,
          brand,
          sub_type: subType,
          finish,
          best_for: bestFor,
          confidence_level: confidenceLevel,
          skin_concern_tags: skinConcernTags,
          image_url: imageUrl,
          image_url_2: imageUrl2,
          image_url_3: imageUrl3,
          status: 'active'
        });
      } else {
        // Parse Category
        // CategoryID (PK)	CategoryName	ProductGroup	Description	ProductCount
        if (parts.length < 3) continue;

        const id = parts[0]?.trim();
        const name = parts[1]?.trim();
        const groupName = parts[2]?.trim();
        const productCountStr = parts[4]?.trim() || '0';

        if (!id || id.startsWith('TOTAL') || id.startsWith('CAT-') === false) {
          continue;
        }

        const productCount = parseInt(productCountStr, 10) || 0;

        categories.push({
          id,
          name,
          group_name: groupName,
          product_count: productCount
        });
      }
    }

    console.log(`Parsed ${categories.length} categories and ${products.length} products.`);

    // 2. Insert/Upsert categories
    console.log('Upserting categories to database...');
    const { error: catError } = await supabase
      .from('categories')
      .upsert(categories, { onConflict: 'id' });

    if (catError) {
      throw new Error(`Category upsert failed: ${catError.message}`);
    }
    console.log('Categories upserted successfully!');

    // 3. Insert/Upsert products in chunks of 50 to avoid request size limits
    console.log('Upserting products to database in chunks...');
    const chunkSize = 50;
    for (let i = 0; i < products.length; i += chunkSize) {
      const chunk = products.slice(i, i + chunkSize);
      const { error: prodError } = await supabase
        .from('products')
        .upsert(chunk, { onConflict: 'id' });

      if (prodError) {
        throw new Error(`Product upsert chunk [${i}-${i+chunkSize}] failed: ${prodError.message}`);
      }
      console.log(`Upserted products ${i + 1} to ${Math.min(i + chunkSize, products.length)}...`);
    }
    console.log('All products upserted successfully!');

    // 4. Update the actual counts of products per category to be dynamically accurate
    console.log('Recalculating and updating category product counts...');
    const { data: countData, error: countError } = await supabase
      .from('products')
      .select('category_id');

    if (countError) {
      throw new Error(`Failed to fetch product list for counts: ${countError.message}`);
    }

    const counts = {};
    countData.forEach(p => {
      if (p.category_id) {
        counts[p.category_id] = (counts[p.category_id] || 0) + 1;
      }
    });

    const categoryUpdates = categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      group_name: cat.group_name,
      product_count: counts[cat.id] || 0
    }));

    const { error: updateError } = await supabase
      .from('categories')
      .upsert(categoryUpdates, { onConflict: 'id' });

    if (updateError) {
      throw new Error(`Category count update failed: ${updateError.message}`);
    }
    console.log('Category product counts updated successfully based on actual database counts!');

    console.log('MIGRATION COMPLETED SUCCESSFULLY!');
  } catch (err) {
    console.error('Migration error:', err.message);
    process.exit(1);
  }
}

runMigration();
