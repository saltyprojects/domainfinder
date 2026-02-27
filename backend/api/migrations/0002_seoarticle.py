from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='SEOArticle',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=300)),
                ('slug', models.SlugField(max_length=300, unique=True)),
                ('url', models.URLField(blank=True, max_length=500)),
                ('platform', models.CharField(choices=[('medium', 'Medium'), ('devto', 'Dev.to'), ('hashnode', 'Hashnode'), ('linkedin', 'LinkedIn'), ('wordpress', 'WordPress'), ('substack', 'Substack'), ('other', 'Other')], max_length=20)),
                ('status', models.CharField(choices=[('draft', 'Draft'), ('published', 'Published'), ('indexed', 'Indexed by Google')], default='draft', max_length=20)),
                ('backlink_url', models.URLField(default='https://domydomains.com', help_text='The domydomains.com URL this article links to', max_length=500)),
                ('backlink_anchor', models.CharField(default='DomyDomains', help_text='Anchor text for the backlink', max_length=200)),
                ('content_summary', models.TextField(blank=True, help_text='Brief summary of article content')),
                ('target_keywords', models.CharField(blank=True, help_text='Comma-separated target keywords', max_length=500)),
                ('published_date', models.DateTimeField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'ordering': ['-published_date', '-created_at'],
            },
        ),
    ]
