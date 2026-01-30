# Database Schema Documentation

## Social Media Clicks Table

The `social_media_clicks` table tracks all social media sharing interactions for polls.

### Table Structure

```sql
CREATE TABLE social_media_clicks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  poll_id UUID NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL,
  user_agent TEXT,
  referrer TEXT,
  utm_source VARCHAR(255),
  utm_medium VARCHAR(255),
  utm_campaign VARCHAR(255),
  utm_content VARCHAR(255),
  clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX idx_social_clicks_poll_id ON social_media_clicks(poll_id);
CREATE INDEX idx_social_clicks_platform ON social_media_clicks(platform);
CREATE INDEX idx_social_clicks_clicked_at ON social_media_clicks(clicked_at);
CREATE INDEX idx_social_clicks_utm_source ON social_media_clicks(utm_source);
```

### Fields Description

| Field          | Type         | Description                                                          |
| -------------- | ------------ | -------------------------------------------------------------------- |
| `id`           | UUID         | Primary key, auto-generated                                          |
| `poll_id`      | UUID         | Foreign key to `polls` table                                         |
| `platform`     | VARCHAR(50)  | Social media platform name (e.g., 'facebook', 'twitter', 'whatsapp') |
| `user_agent`   | TEXT         | Browser user agent string                                            |
| `referrer`     | TEXT         | HTTP referrer URL                                                    |
| `utm_source`   | VARCHAR(255) | UTM source parameter (e.g., 'facebook', 'twitter')                   |
| `utm_medium`   | VARCHAR(255) | UTM medium parameter (e.g., 'social')                                |
| `utm_campaign` | VARCHAR(255) | UTM campaign parameter (e.g., 'poll_share')                          |
| `utm_content`  | VARCHAR(255) | UTM content parameter (e.g., 'poll_123')                             |
| `clicked_at`   | TIMESTAMP    | When the share click occurred                                        |
| `created_at`   | TIMESTAMP    | Record creation timestamp                                            |

### Supported Platforms

The following platforms are tracked:

- `facebook` - Facebook sharing
- `twitter` / `x_share` - Twitter/X sharing
- `linkedin` - LinkedIn sharing
- `whatsapp` - WhatsApp sharing
- `telegram` - Telegram sharing
- `reddit` - Reddit sharing
- `pinterest` - Pinterest sharing
- `discord` - Discord sharing
- `threads` - Threads sharing
- `tiktok` - TikTok sharing
- `ig_story` - Instagram Stories sharing

### API Usage

#### Track a Social Click

**Endpoint:** `POST /api/analytics/social-click`

**Request Body:**

```json
{
  "poll_id": 123,
  "platform": "facebook",
  "user_agent": "Mozilla/5.0...",
  "referrer": "https://example.com",
  "utm_source": "facebook",
  "utm_medium": "social",
  "utm_campaign": "poll_share",
  "utm_content": "poll_123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Click tracked successfully"
}
```

#### Get Click Statistics for a Poll

**Endpoint:** `GET /api/analytics/social-click?poll_id=123`

**Response:**

```json
{
  "total": 45,
  "platforms": [
    { "platform": "facebook", "count": 20 },
    { "platform": "twitter", "count": 15 },
    { "platform": "whatsapp", "count": 10 }
  ]
}
```

### Dashboard Analytics

The dashboard API (`GET /api/analytics/dashboard`) aggregates social click data to provide:

1. **Total Shares** - Count of all social media clicks
2. **Recent Shares** - Shares within the selected timeframe
3. **Platform Distribution** - Breakdown by platform
4. **UTM Source Statistics** - Traffic source analysis
5. **Referrer Statistics** - Top referring domains
6. **Daily Shares** - Time-series data for charting

### Integration Example

```javascript
// Track social click when user shares
const trackSocialClick = async (platform) => {
  await fetch("/api/analytics/social-click", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      poll_id: pollData.id,
      platform: platform.toLowerCase(),
      user_agent: navigator.userAgent,
      referrer: document.referrer,
      utm_source: platform.toLowerCase(),
      utm_medium: "social",
      utm_campaign: "poll_share",
      utm_content: `poll_${pollData.id}`,
    }),
  });
};
```

### Notes

- All timestamps are stored in UTC
- The `poll_id` must reference an existing poll in the `polls` table
- Platform names are normalized to lowercase
- UTM parameters are optional but recommended for better analytics
- The table uses CASCADE delete, so clicks are removed when a poll is deleted
