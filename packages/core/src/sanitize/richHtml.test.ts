import { describe, it, expect } from 'vitest';
import { sanitizeRichHtml } from './richHtml.js';

describe('sanitizeRichHtml — allowed shapes', () => {
  it('keeps TipTap-produced plain paragraphs', () => {
    expect(sanitizeRichHtml('<p>hello world</p>')).toBe('<p>hello world</p>');
  });

  it('keeps inline marks (strong, em, u, s)', () => {
    expect(sanitizeRichHtml('<p><strong>bold</strong> and <em>italic</em> and <u>under</u></p>')).toBe(
      '<p><strong>bold</strong> and <em>italic</em> and <u>under</u></p>',
    );
  });

  it('keeps hard line breaks (void tag normalized to self-close)', () => {
    expect(sanitizeRichHtml('<p>one<br>two</p>')).toBe('<p>one<br />two</p>');
    expect(sanitizeRichHtml('<p>one<br />two</p>')).toBe('<p>one<br />two</p>');
  });

  it('keeps span with color style', () => {
    expect(sanitizeRichHtml('<span style="color: #ff00ff">pink</span>')).toBe(
      '<span style="color: #ff00ff">pink</span>',
    );
  });

  it('keeps p with text-align style', () => {
    expect(sanitizeRichHtml('<p style="text-align: center">centered</p>')).toBe(
      '<p style="text-align: center">centered</p>',
    );
  });

  it('passes plain text through unchanged', () => {
    expect(sanitizeRichHtml('just some text')).toBe('just some text');
  });

  it('escapes ambient text containing < and > so it cannot reach the DOM as markup', () => {
    expect(sanitizeRichHtml('a < b and c > d')).toBe('a &lt; b and c &gt; d');
  });
});

describe('sanitizeRichHtml — attack vectors (XSS-class)', () => {
  it('strips <script> tags entirely', () => {
    expect(sanitizeRichHtml('<p>hi<script>alert(1)</script></p>')).toBe('<p>hialert(1)</p>');
  });

  it('strips <iframe>', () => {
    expect(sanitizeRichHtml('<iframe src="https://evil"></iframe>hello')).toBe('hello');
  });

  it('strips <object> / <embed>', () => {
    expect(sanitizeRichHtml('<object data="x"></object>')).toBe('');
    expect(sanitizeRichHtml('<embed src="x" />')).toBe('');
  });

  it('strips inline event handler attributes', () => {
    expect(sanitizeRichHtml('<p onclick="alert(1)">hi</p>')).toBe('<p>hi</p>');
    expect(sanitizeRichHtml('<span onerror="x" onload="y">hi</span>')).toBe('<span>hi</span>');
  });

  it('strips javascript: in style values', () => {
    // background:url(javascript:...) — the whole property is rejected
    // because `background` isn't in the style allowlist.
    expect(sanitizeRichHtml('<span style="background: url(javascript:alert(1))">hi</span>')).toBe(
      '<span>hi</span>',
    );
  });

  it('rejects malformed color values', () => {
    expect(
      sanitizeRichHtml('<span style="color: javascript:alert(1)">hi</span>'),
    ).toBe('<span>hi</span>');
    expect(sanitizeRichHtml('<span style="color: url(http://e/x.css)">hi</span>')).toBe(
      '<span>hi</span>',
    );
    expect(sanitizeRichHtml('<span style="color: expression(alert(1))">hi</span>')).toBe(
      '<span>hi</span>',
    );
  });

  it('rejects unknown text-align values', () => {
    expect(sanitizeRichHtml('<p style="text-align: javascript:">hi</p>')).toBe('<p>hi</p>');
  });

  it('strips style declarations with allowed prop but evil sibling prop', () => {
    // Allowed `color: red` survives; disallowed `background: url(...)` drops.
    const out = sanitizeRichHtml(
      '<span style="color: #ff0000; background: url(javascript:1)">hi</span>',
    );
    expect(out).toBe('<span style="color: #ff0000">hi</span>');
  });

  it('drops HTML comments entirely', () => {
    expect(sanitizeRichHtml('<p>hi<!-- nasty --></p>')).toBe('<p>hi</p>');
  });

  it('drops DOCTYPE / processing instructions', () => {
    expect(sanitizeRichHtml('<!DOCTYPE html><p>hi</p>')).toBe('<p>hi</p>');
    expect(sanitizeRichHtml('<?xml version="1.0"?><p>hi</p>')).toBe('<p>hi</p>');
  });

  it('does not let attribute-quote tricks open a new tag', () => {
    // The `>` inside the quoted value must not terminate the open tag.
    const out = sanitizeRichHtml('<span title="oops>more">hi</span>');
    expect(out).toBe('<span>hi</span>'); // title not in allowlist, dropped.
  });

  it('strips unknown tags while keeping their text content', () => {
    expect(sanitizeRichHtml('<div>hi <marquee>bye</marquee></div>')).toBe('hi bye');
  });

  it('handles unterminated tags safely (does not crash)', () => {
    expect(() => sanitizeRichHtml('<p>hi <span style="')).not.toThrow();
  });

  it('escapes lone < / > characters in text so they can\'t be re-interpreted', () => {
    expect(sanitizeRichHtml('<p>1 < 2 & 2 > 1</p>')).toBe('<p>1 &lt; 2 &amp; 2 &gt; 1</p>');
  });

  it('handles non-string input', () => {
    expect(sanitizeRichHtml(null)).toBe('');
    expect(sanitizeRichHtml(undefined)).toBe('');
    expect(sanitizeRichHtml(42)).toBe('');
    expect(sanitizeRichHtml({})).toBe('');
    expect(sanitizeRichHtml('')).toBe('');
  });
});
