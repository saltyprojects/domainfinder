"""
Algorithmic domain name generator.
Zero API cost, instant results.
"""

PREFIXES = [
    'get', 'try', 'my', 'go', 'hey', 'use', 'the',
    'be', 'on', 'hi', 'do', 'to',
]

SUFFIXES = [
    'hub', 'ly', 'ify', 'app', 'lab', 'base', 'io',
    'hq', 'up', 'now', 'go', 'ai', 'co', 'pro',
    'box', 'kit', 'dev', 'run', 'zen', 'ful',
]

TECH_WORDS = [
    'cloud', 'stack', 'byte', 'pixel', 'logic', 'node',
    'flux', 'sync', 'dash', 'core', 'fast', 'snap',
    'bold', 'next', 'prime', 'alpha', 'nova', 'spark',
]


def drop_vowels(name: str) -> str | None:
    """Flickr-style vowel dropping (keep first char)."""
    if len(name) < 4:
        return None
    result = name[0] + ''.join(c for c in name[1:] if c not in 'aeiou')
    return result if result != name and len(result) >= 3 else None


def truncate(name: str) -> list[str]:
    """Short truncations of longer names."""
    results = []
    if len(name) >= 6:
        results.append(name[:4])
        results.append(name[:5])
    return results


def generate_suggestions(name: str) -> list[str]:
    """Generate domain name suggestions from a base name. Returns unique names."""
    name = name.lower().strip().replace(' ', '').replace('-', '')
    if not name:
        return []

    suggestions = set()

    # Prefix combos
    for prefix in PREFIXES:
        suggestions.add(f"{prefix}{name}")

    # Suffix combos
    for suffix in SUFFIXES:
        suggestions.add(f"{name}{suffix}")

    # Tech word combos
    for word in TECH_WORDS:
        suggestions.add(f"{name}{word}")
        suggestions.add(f"{word}{name}")

    # Vowel drop
    dropped = drop_vowels(name)
    if dropped:
        suggestions.add(dropped)
        for suffix in ['ly', 'io', 'app', 'hq']:
            suggestions.add(f"{dropped}{suffix}")

    # Truncations
    for t in truncate(name):
        suggestions.add(t)
        for suffix in ['ly', 'io', 'app']:
            suggestions.add(f"{t}{suffix}")

    # Double letter style
    if len(name) >= 3:
        suggestions.add(f"{name}{name[-1]}")

    # Remove the original name and any too-short results
    suggestions.discard(name)
    suggestions = [s for s in suggestions if 3 <= len(s) <= 30]

    # Sort by length (shorter = more brandable)
    suggestions.sort(key=lambda s: (len(s), s))

    return suggestions[:50]
