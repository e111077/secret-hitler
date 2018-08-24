import { LitElement, html } from '@polymer/lit-element';

class SecretHitler extends LitElement {
  render() {
    return html`
      <div>I am secretly hitler!</div>
    `;
  }
}

customElements.define('secret-hitler', SecretHitler);