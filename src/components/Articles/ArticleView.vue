<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useArticles } from '@/stores/articles';
import { useDarkMode } from '@/stores/darkmode';
import MarkdownIt from 'markdown-it';
import Tape from './Tape.vue';
import DiagramBlock from './DiagramBlock.vue';

const route = useRoute();
const articlesStore = useArticles();
const darkmode = useDarkMode();
const md = new MarkdownIt({ html: true, breaks: true, linkify: true });

interface Block {
    id: number;
    type: 'markdown' | 'tape' | 'diagram';
    content?: string;
    audio?: string;
    base64?: string;
}

const blocks = ref<Block[]>([]);

const matchers = [
    { type: 'tape', regex: /\[([^\]]*)\]\(([^)]+\.(?:m4a|mp3|ogg|wav))\)\s*\{\.is-tape\}/ },
    { type: 'tape-legacy', regex: /<Tape\s+audio=["']([^"']+)["']\s*(?:\/>|><\/Tape>)/ },
    { type: 'diagram', regex: /```diagram\n([\s\S]*?)\n```/ }
];

function parseTagChain(tagStr: string): string {
    // Extract all tag contents inside {...}
    const blocks = Array.from(tagStr.matchAll(/\{([^{}]+)\}/g), m => m[1]);
    let classes: string[] = [];
    
    for (const block of blocks) {
        // split by '.' and filter out empty strings
        const tags = block.split('.').map(t => t.trim()).filter(t => t.length > 0);
        classes.push(...tags);
    }
    
    // Normalize well-known classes
    classes = classes.map(tag => {
        if (['info', 'warning', 'danger', 'success'].includes(tag)) return `callout callout-${tag}`;
        if (tag.startsWith('is-') && ['info', 'warning', 'danger', 'success'].includes(tag.slice(3))) return `callout callout-${tag.slice(3)}`;
        if (tag === 'is-dark' || tag === 'dark') return 'dark-only';
        if (tag === 'is-light' || tag === 'light') return 'light-only';
        if (tag === 'is-toggle' || tag === 'toggle') return 'toggleable';
        return tag;
    });

    // Remove duplicates and flatten composite classes
    return Array.from(new Set(classes.flatMap(c => c.split(' ')))).join(' ');
}

function preprocessMarkdown(text: string): string {
    let clean = text;

    // 0. Fenced Container Blocks: ::: {.tag.tag} \n content \n :::
    clean = clean.replace(/^:::[ \t]*(\{[\w.-]+\}(?:[ \t]*\{[\w.-]+\})*)\n([\s\S]*?)\n:::[ \t]*$/gm, (_m, tagsStr, content) => {
        const classList = parseTagChain(tagsStr);
        return `\n<div class="${classList}">\n\n${content.trim()}\n\n</div>\n`;
    });

    // 1. Link-wrapped images with tags: [![alt](src) {.tag1.tag2}](url)
    clean = clean.replace(/\[!\[([^\]]*)\]\(([^)]+)\)\s*((?:\{[\w.-]+\}\s*)+)\]\(([^)]+)\)/g, (_m, alt, src, tagsStr, url) => {
        const classList = parseTagChain(tagsStr);
        return `<a href="${url}" target="_blank" rel="noopener" class="${classList}"><img src="${src}" alt="${alt}" class="${classList} toggle-image" /></a>`;
    });

    // 2. Standalone images with tags: ![alt](src) {.tag1.tag2}
    clean = clean.replace(/!\[([^\]]*)\]\(([^)]+)\)\s*((?:\{[\w.-]+\}\s*)+)/g, (_m, alt, src, tagsStr) => {
        const classStr = parseTagChain(tagsStr);
        const classes = classStr.split(' ');
        const isToggle = classes.includes('toggleable');
        if (isToggle && !src.includes('_dark') && !src.includes('_light')) {
            const extMatch = src.match(/\.[^/.]+$/);
            const ext = extMatch ? extMatch[0] : '.png';
            const base = extMatch ? src.replace(/\.[^/.]+$/, '') : src;
            const darkSrc = `${base}_dark${ext}`;
            const lightSrc = `${base}_light${ext}`;
            const baseClasses = classes.filter(c => c !== 'toggleable');
            const darkClasses = ['toggle-image', 'dark-only', ...baseClasses].join(' ');
            const lightClasses = ['toggle-image', 'light-only', ...baseClasses].join(' ');
            return `<img src="${darkSrc}" alt="${alt}" class="${darkClasses}" /><img src="${lightSrc}" alt="${alt}" class="${lightClasses}" />`;
        }
        const classList = ['toggle-image', ...classes].join(' ');
        return `<img src="${src}" alt="${alt}" class="${classList}" />`;
    });

    // 3. Blockquotes (single line or multi line) with optional trailing tags on a new line
    clean = clean.replace(/^((?:>.*(?:\n|$))+)(?:([ \t]*(?:\{[\w.-]+\}[ \t]*)+)(?:\n|$))?/gm, (match, blockLines, trailingTags) => {
        let tagsStr = trailingTags || "";
        
        // Only extract tags that are strictly at the end of a line within the blockquote
        let blockText = blockLines.replace(/([ \t]*\{[\w.-]+\}[ \t]*)+$/gm, (tagMatch: string) => {
            tagsStr += tagMatch + " ";
            return "";
        });

        if (!tagsStr.trim()) return match; // Leave untouched if no tags found at line ends

        let content = blockText.split('\n').map((line: string) => line.replace(/^>[ \t]?/, '')).join('\n').trim();
        const classList = parseTagChain(tagsStr);
        
        if (classList.includes('callout')) {
            return `\n<div class="${classList}">\n\n${content}\n\n</div>\n`;
        } else {
            return `\n<blockquote class="${classList}">\n\n${content}\n\n</blockquote>\n`;
        }
    });

    // 4. Headings with tags: ### Heading text {.tag1.tag2}
    clean = clean.replace(/^(#{1,6}\s+.*?)\s*((?:\{[\w.-]+\}\s*)+)$/gm, (_match, heading, tagsStr) => {
        const classList = parseTagChain(tagsStr);
        return `\n<div class="${classList}">\n\n${heading}\n\n</div>\n`;
    });

    // 5. Text / paragraph lines or list items ending with tags
    clean = clean.replace(/^([ \t]*(?:[-*+]|\d+\.)[ \t]+)?(?!<|#|\||>|\s*$)(.*?)\s*((?:\{[\w.-]+\}\s*)+)$/gm, (match, listMarker, content, tagsStr) => {
        if (!content || !content.trim()) return match;
        const prefix = listMarker || '';
        const classList = parseTagChain(tagsStr);
        if (classList.includes('callout')) {
            return `${prefix}\n<div class="${classList}">\n\n${content}\n\n</div>\n`;
        }
        return `${prefix}<span class="${classList}">${content}</span>`;
    });

    // 6. Legacy StyleText tag
    clean = clean.replace(/<StyleText\s+font=["']([^"']+)["']>([\s\S]*?)<\/StyleText>/g, '<span class="font-$1">$2</span>');

    return clean;
}

function parseBlocks(text: string): Block[] {
    const parsedBlocks: Block[] = [];
    let remaining = preprocessMarkdown(text);
    let idCounter = 0;

    while (remaining.length > 0) {
        let earliestMatch: RegExpExecArray | null = null;
        let earliestIndex = remaining.length;
        let earliestMatcher = null;

        for (const matcher of matchers) {
            const match = matcher.regex.exec(remaining);
            if (match && match.index < earliestIndex) {
                earliestIndex = match.index;
                earliestMatch = match;
                earliestMatcher = matcher;
            }
        }

        if (earliestMatch && earliestMatcher) {
            if (earliestIndex > 0) {
                parsedBlocks.push({
                    id: idCounter++,
                    type: 'markdown',
                    content: md.render(remaining.slice(0, earliestIndex))
                });
            }

            if (earliestMatcher.type === 'tape') {
                parsedBlocks.push({ id: idCounter++, type: 'tape', audio: earliestMatch[2] });
            } else if (earliestMatcher.type === 'tape-legacy') {
                parsedBlocks.push({ id: idCounter++, type: 'tape', audio: earliestMatch[1] });
            } else if (earliestMatcher.type === 'diagram') {
                parsedBlocks.push({ id: idCounter++, type: 'diagram', base64: earliestMatch[1] });
            }

            remaining = remaining.slice(earliestIndex + earliestMatch[0].length);
        } else {
            parsedBlocks.push({
                id: idCounter++,
                type: 'markdown',
                content: md.render(remaining)
            });
            break;
        }
    }
    return parsedBlocks;
}

const loadArticle = async () => {
    const slug = route.params.slug as string;
    if (slug) {
        await articlesStore.fetchArticleDetail(slug);
        if (articlesStore.currentArticleDetail) {
            blocks.value = parseBlocks(articlesStore.currentArticleDetail.content);
        } else {
            blocks.value = [];
        }
    }
};

onMounted(loadArticle);
watch(() => route.params.slug, loadArticle);

</script>

<template>
    <div class="article-view" v-if="articlesStore.isLoading">
        <p>Loading article...</p>
    </div>
    <div class="article-view" v-else-if="articlesStore.error">
        <p class="error">{{ articlesStore.error }}</p>
    </div>
    <div class="article-view" v-else-if="articlesStore.currentArticleDetail">
        <h1>{{ articlesStore.currentArticleDetail.title }}</h1>
        <p class="short-desc">{{ articlesStore.currentArticleDetail.short_desc }}</p>
        <hr />
        
        <div class="article-content" :class="{ 'dark-mode': darkmode.isDark, 'light-mode': !darkmode.isDark }">
            <template v-for="block in blocks" :key="block.id">
                <div v-if="block.type === 'markdown'" class="markdown-body" v-html="block.content"></div>
                <Tape v-else-if="block.type === 'tape' && block.audio" :audio="block.audio" />
                <DiagramBlock v-else-if="block.type === 'diagram' && block.base64" :base64="block.base64" />
            </template>
        </div>
    </div>
    <div class="article-view" v-else>
        <p>Article not found.</p>
    </div>
</template>

<style scoped>
.article-view {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
}

.short-desc {
    font-style: italic;
    color: #888;
    margin-bottom: 2rem;
}

.error {
    color: red;
    font-weight: bold;
}

.markdown-body {
    line-height: 1.6;
}
</style>