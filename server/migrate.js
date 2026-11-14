require('dotenv').config();
const mongoose = require('mongoose');
const Gift = require('./models/gift'); // ודאי שהאות הגדולה/קטנה תואמת לשם הקובץ שלך

async function runMigration() {
    try {
        await mongoose.connect(process.env.DATABASE_URI);
        console.log('Connected to DB...');

        const result = await Gift.updateMany(
            {
                $or: [
                    { category: { $exists: true } },
                    { event: { $exists: true } },
                    { relationship: { $exists: true } }
                ]
            },
            [
                {
                    $set: {
                        // אם השדה הישן קיים - הופך אותו למערך. אחרת - שומר על המערך הקיים (או מערך ריק)
                        categories: {
                            $cond: [
                                { $ifNull: ["$category", false] },
                                ["$category"],
                                { $ifNull: ["$categories", []] }
                            ]
                        },
                        events: {
                            $cond: [
                                { $ifNull: ["$event", false] },
                                ["$event"],
                                { $ifNull: ["$events", []] }
                            ]
                        },
                        relationships: {
                            $cond: [
                                { $ifNull: ["$relationship", false] },
                                ["$relationship"],
                                { $ifNull: ["$relationships", []] }
                            ]
                        }
                    }
                },
                {
                    $unset: ["category", "event", "relationship"]
                }
            ],
            { updatePipeline: true }
        );

        console.log(`Migration finished! Modified ${result.modifiedCount} gifts.`);
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await mongoose.disconnect();
    }
}

runMigration();