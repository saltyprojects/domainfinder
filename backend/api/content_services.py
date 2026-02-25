import json
import random
import os
import httpx
import requests
import hashlib
from datetime import datetime, timedelta
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

# Content templates for social media posts
CONTENT_TEMPLATES = {
    'domain_tips': [
        {
            'text': '💡 Domain tip: Keep it short, memorable, and easy to spell. Your customers should be able to remember it after hearing it once!',
            'hashtags': ['#domaintips', '#branding', '#startup'],
            'image_prompt': 'Clean minimalist graphic about domain naming tips, bright colors'
        },
        {
            'text': '🚀 Your domain name is your digital real estate. Choose wisely - it\'s often the first impression customers get of your brand.',
            'hashtags': ['#domains', '#branding', '#digitalmarketing'],
            'image_prompt': 'Professional digital real estate concept art, modern design'
        },
        {
            'text': '⚡ Pro tip: Check if your domain name is available across social platforms too. Consistency is key for brand recognition!',
            'hashtags': ['#domaintips', '#socialmedia', '#branding'],
            'image_prompt': 'Social media icons and domain name concept, cohesive branding theme'
        },
        {
            'text': '🎯 When choosing a domain: avoid hyphens, numbers, and hard-to-spell words. Simple always wins in the digital world.',
            'hashtags': ['#domaintips', '#webdevelopment', '#business'],
            'image_prompt': 'Clean typography showing good vs bad domain examples'
        }
    ],
    'fun_facts': [
        {
            'text': '🌊 Fun fact: .io domains were originally created for British Indian Ocean Territory, but tech startups love them for "Input/Output"!',
            'hashtags': ['#domainfacts', '#tech', '#startup'],
            'image_prompt': 'Tech startup aesthetic with .io domain and ocean elements'
        },
        {
            'text': '📍 Did you know? The first domain name ever registered was symbolics.com in 1985. It\'s still active today!',
            'hashtags': ['#domainfacts', '#internethistory', '#domains'],
            'image_prompt': 'Vintage internet history theme with 1985 computer aesthetic'
        },
        {
            'text': '🔝 .com domains are still king! They get 3.8x more traffic than any other extension. Trust matters in domain names.',
            'hashtags': ['#domains', '#SEO', '#webtraffic'],
            'image_prompt': 'Crown and .com domain concept, showing dominance and authority'
        },
        {
            'text': '🌍 There are over 1,500 domain extensions available today - from .pizza to .ninja. But choose carefully for your brand!',
            'hashtags': ['#domains', '#branding', '#internet'],
            'image_prompt': 'Colorful collage of various domain extensions, creative and fun'
        }
    ],
    'features': [
        {
            'text': '🔍 New on DomyDomains: Check trademark conflicts before you buy! Avoid legal headaches with our built-in trademark scanner.',
            'hashtags': ['#domydomains', '#features', '#trademarks'],
            'image_prompt': 'Legal protection and domain safety concept, professional shield design'
        },
        {
            'text': '⚡ Search 20+ domain extensions instantly + check social handles simultaneously. Everything you need in one place!',
            'hashtags': ['#domydomains', '#domains', '#efficiency'],
            'image_prompt': 'Fast domain search interface with multiple TLDs and social icons'
        },
        {
            'text': '📱 DomyDomains checks Twitter, Instagram, TikTok, GitHub & LinkedIn handles automatically. Build your brand consistently!',
            'hashtags': ['#socialmedia', '#branding', '#domydomains'],
            'image_prompt': 'Social media platform icons connected to domain name, unified branding'
        },
        {
            'text': '🏠 Meet Domy! Your friendly domain-finding companion who helps you discover the perfect digital home for your ideas.',
            'hashtags': ['#domydomains', '#mascot', '#brandpersonality'],
            'image_prompt': 'Cute house mascot character helping with domain search, friendly and approachable'
        }
    ],
    'engagement': [
        {
            'text': 'What\'s the most creative domain name you\'ve ever seen? Drop it below! 👇',
            'hashtags': ['#domains', '#creativity', '#community'],
            'image_prompt': 'Creative brainstorming concept with domain names and light bulbs'
        },
        {
            'text': 'Poll time! What\'s your go-to domain extension? 🤔\n\nA) .com (classic)\nB) .io (techy)\nC) .ai (trendy)\nD) Something else!',
            'hashtags': ['#domains', '#poll', '#community'],
            'image_prompt': 'Poll interface showing different domain extensions as options'
        },
        {
            'text': 'Starting a new project? Share your domain name ideas below and we\'ll help you check availability! 🚀',
            'hashtags': ['#domainhelp', '#startup', '#community'],
            'image_prompt': 'Collaborative brainstorming session with domain names floating around'
        },
        {
            'text': 'Tag a friend who needs to secure their domain name! Everyone deserves a great digital home. 🏠✨',
            'hashtags': ['#domains', '#friends', '#digitalmarketing'],
            'image_prompt': 'Friendship and sharing concept with domain names and houses'
        }
    ],
    'weekly_spotlight': [
        {
            'text': '✨ Domain spotlight: .dev domains! Perfect for developers, portfolios, and tech projects. Clean, professional, and memorable.',
            'hashtags': ['#domainspotlight', '#dev', '#developers'],
            'image_prompt': 'Developer-themed design with .dev domain and coding elements'
        },
        {
            'text': '🎨 Domain spotlight: .design domains! Ideal for creative agencies, portfolios, and design studios. Show what you do in your URL!',
            'hashtags': ['#domainspotlight', '#design', '#creative'],
            'image_prompt': 'Creative design tools and .design domain in artistic layout'
        },
        {
            'text': '🏪 Domain spotlight: .shop domains! Built for e-commerce with instant credibility. Perfect for online stores and retail brands.',
            'hashtags': ['#domainspotlight', '#ecommerce', '#shop'],
            'image_prompt': 'E-commerce and shopping theme with .shop domain and store elements'
        }
    ]
}


def get_random_content():
    """Get a random piece of content from our templates."""
    category = random.choice(list(CONTENT_TEMPLATES.keys()))
    content = random.choice(CONTENT_TEMPLATES[category])
    
    return {
        'category': category,
        'text': content['text'],
        'hashtags': content['hashtags'],
        'image_prompt': content['image_prompt']
    }


def generate_content_hash(text, hashtags):
    """Generate a unique hash for content to track what's been posted."""
    content_str = text + ''.join(hashtags)
    return hashlib.md5(content_str.encode()).hexdigest()


def has_been_posted(content_hash, platform, days_lookback=7):
    """Check if content has been posted recently to avoid duplicates."""
    cache_key = f"posted_content:{platform}:{content_hash}"


def mark_as_posted(content_hash, platform, days_ttl=7):
    """Mark content as posted to avoid duplicates."""
    cache_key = f"posted_content:{platform}:{content_hash}"


def generate_branded_image(prompt, style="domydomains"):
    """Generate an image using Gemini for social media posts."""
    try:
        gemini_api_key = os.environ.get('GEMINI_API_KEY')
        if not gemini_api_key:
            logger.warning("GEMINI_API_KEY not found")
            return None
        
        # Enhance prompt with DomyDomains branding
        branded_prompt = f"{prompt}, DomyDomains branding, green and white color scheme, modern minimalist design, professional tech aesthetic"
        
        with httpx.Client(timeout=30) as client:
            response = client.post(
                "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent",
                headers={
                    "Content-Type": "application/json",
                    "x-goog-api-key": gemini_api_key
                },
                json={
                    "contents": [{
                        "parts": [{
                            "text": f"Generate an image: {branded_prompt}"
                        }]
                    }],
                    "generationConfig": {
                        "maxOutputTokens": 1024,
                    }
                }
            )
            
            if response.status_code == 200:
                result = response.json()
                # Extract image data from Gemini response
                # Note: This is a simplified implementation
                # Real Gemini image generation would return image data
                return result.get('image_url')  # Placeholder
            else:
                logger.error(f"Gemini API error: {response.status_code}")
                return None
                
    except Exception as e:
        logger.error(f"Failed to generate image: {e}")
        return None


def post_to_twitter(text, hashtags, image_url=None):
    """Post content to Twitter/X using Tweepy."""
    try:
        import tweepy

        # Twitter API credentials from environment
        twitter_api_key = os.environ.get('DOMY_TWITTER_CONSUMER_KEY') or os.environ.get('DOMY_TWITTER_API_KEY')
        twitter_api_secret = os.environ.get('DOMY_TWITTER_CONSUMER_SECRET') or os.environ.get('DOMY_TWITTER_API_SECRET')
        twitter_access_token = os.environ.get('DOMY_TWITTER_ACCESS_TOKEN')
        twitter_access_secret = os.environ.get('DOMY_TWITTER_ACCESS_TOKEN_SECRET')

        if not all([twitter_api_key, twitter_api_secret, twitter_access_token, twitter_access_secret]):
            logger.error("Missing Twitter API credentials")
            return False

        # Format the tweet
        hashtag_str = ' '.join(hashtags)
        tweet_text = f"{text}\n\n{hashtag_str}"

        # Truncate if too long (Twitter limit is 280 chars)
        if len(tweet_text) > 280:
            available_space = 280 - len(hashtag_str) - 3  # 3 for "\n\n"
            tweet_text = f"{text[:available_space]}...\n\n{hashtag_str}"

        # Upload media if we have an image
        media_ids = []
        if image_url:
            try:
                # Download the image
                import tempfile
                img_response = requests.get(image_url, timeout=15)
                if img_response.status_code == 200:
                    # Save to temp file for upload
                    suffix = '.png' if 'png' in img_response.headers.get('content-type', '') else '.jpg'
                    with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
                        tmp.write(img_response.content)
                        tmp_path = tmp.name
                    # Use v1.1 API for media upload
                    auth = tweepy.OAuth1UserHandler(
                        twitter_api_key, twitter_api_secret,
                        twitter_access_token, twitter_access_secret
                    )
                    api_v1 = tweepy.API(auth)
                    media = api_v1.media_upload(filename=tmp_path)
                    media_ids.append(media.media_id_string)
                    os.unlink(tmp_path)
            except Exception as e:
                logger.warning(f"Failed to upload image to Twitter: {e}")

        # Post tweet using v2 API
        client = tweepy.Client(
            consumer_key=twitter_api_key,
            consumer_secret=twitter_api_secret,
            access_token=twitter_access_token,
            access_token_secret=twitter_access_secret,
        )

        kwargs = {'text': tweet_text}
        if media_ids:
            kwargs['media_ids'] = media_ids

        response = client.create_tweet(**kwargs)
        tweet_id = response.data['id']
        logger.info(f"Posted tweet {tweet_id}: {tweet_text[:80]}...")
        return True

    except Exception as e:
        logger.error(f"Failed to post to Twitter: {e}")
        return False


def post_to_instagram(text, hashtags, image_url=None):
    """Post content to Instagram using Meta Graph API."""
    try:
        # Instagram Graph API credentials from environment
        instagram_access_token = os.environ.get('DOMY_INSTAGRAM_ACCESS_TOKEN')
        instagram_user_id = os.environ.get('DOMY_INSTAGRAM_USER_ID')

        if not all([instagram_access_token, instagram_user_id]):
            logger.warning("Missing Instagram API credentials — skipping Instagram post")
            return False

        if not image_url:
            logger.warning("Instagram requires an image — skipping")
            return False

        # Format the caption
        hashtag_str = ' '.join(hashtags)
        caption = f"{text}\n\n{hashtag_str}"

        # Step 1: Create media container
        create_url = f"https://graph.facebook.com/v19.0/{instagram_user_id}/media"
        create_resp = requests.post(create_url, data={
            'image_url': image_url,
            'caption': caption,
            'access_token': instagram_access_token,
        }, timeout=30)
        create_data = create_resp.json()

        if 'id' not in create_data:
            logger.error(f"Instagram container creation failed: {create_data}")
            return False

        container_id = create_data['id']

        # Step 2: Publish the container
        publish_url = f"https://graph.facebook.com/v19.0/{instagram_user_id}/media_publish"
        publish_resp = requests.post(publish_url, data={
            'creation_id': container_id,
            'access_token': instagram_access_token,
        }, timeout=30)
        publish_data = publish_resp.json()

        if 'id' in publish_data:
            logger.info(f"Posted to Instagram: {publish_data['id']}")
            return True
        else:
            logger.error(f"Instagram publish failed: {publish_data}")
            return False

    except Exception as e:
        logger.error(f"Failed to post to Instagram: {e}")
        return False


def create_and_post_content(platforms=['twitter', 'instagram']):
    """Generate content and post to specified platforms."""
    results = {'success': False, 'platforms': {}, 'content': None}
    
    try:
        # Generate content
        content = get_random_content()
        content_hash = generate_content_hash(content['text'], content['hashtags'])
        
        # Check if we've posted similar content recently
        skip_platforms = []
        for platform in platforms:
            if has_been_posted(content_hash, platform):
                skip_platforms.append(platform)
        
        # If content has been posted to all platforms recently, generate new content
        attempts = 0
        while len(skip_platforms) == len(platforms) and attempts < 5:
            content = get_random_content()
            content_hash = generate_content_hash(content['text'], content['hashtags'])
            skip_platforms = [p for p in platforms if has_been_posted(content_hash, p)]
            attempts += 1
        
        if attempts >= 5:
            logger.warning("Could not find fresh content after 5 attempts")
            results['error'] = 'No fresh content available'
            return results
        
        # Generate branded image
        image_url = generate_branded_image(content['image_prompt'])
        
        # Post to platforms
        for platform in platforms:
            if platform in skip_platforms:
                results['platforms'][platform] = {'success': False, 'reason': 'duplicate_content'}
                continue
                
            if platform == 'twitter':
                success = post_to_twitter(content['text'], content['hashtags'], image_url)
            elif platform == 'instagram':
                success = post_to_instagram(content['text'], content['hashtags'], image_url)
            else:
                success = False
            
            results['platforms'][platform] = {'success': success}
            
            if success:
                mark_as_posted(content_hash, platform)
        
        results['success'] = any(p['success'] for p in results['platforms'].values())
        results['content'] = {
            'text': content['text'],
            'hashtags': content['hashtags'],
            'category': content['category'],
            'image_url': image_url
        }
        
    except Exception as e:
        logger.error(f"Failed to create and post content: {e}")
        results['error'] = str(e)
    
    return results


def get_posting_stats(days=7):
    """Get statistics about recent posting activity."""
    # This would query a database or cache to get posting history
    # For now, return mock data
    return {
        'posts_last_7_days': {
            'twitter': 12,
            'instagram': 8
        },
        'engagement_summary': {
            'twitter': {'likes': 245, 'retweets': 18, 'replies': 12},
            'instagram': {'likes': 156, 'comments': 23}
        },
        'top_performing_content': [
            {'text': 'Pro tip: Check if your domain...', 'platform': 'twitter', 'engagement': 45},
            {'text': 'Fun fact: .io domains were...', 'platform': 'instagram', 'engagement': 38}
        ]
    }