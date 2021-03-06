/**
 * Copyright 2016 The Incremental DOM Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
    patch,
    elementOpenStart,
    elementOpenEnd,
    elementClose,
    elementVoid,
    currentPointer
} from '../../index';

describe('currentPointer', () => {
  let container;
  let firstChild
  let lastChild;

  beforeEach(() => {
    container = document.createElement('div');
    container.innerHTML = `<div></div><span></span>`;

    firstChild = container.firstChild;
    lastChild = container.lastChild;

    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('should return null if no children', () => {
    container.innerHTML = '';

    let el;

    patch(container, () => {
      el = currentPointer();
    });

    expect(el).to.equal(null);
  });

  it('should return the first child when an element was just opened', () => {
    let el;

    patch(container, () => {
      el = currentPointer();
    });

    expect(el).to.equal(firstChild);
  });

  it('should return the next node to evaluate', () => {
    let el;

    patch(container, () => {
      elementVoid('div');
      el = currentPointer();
    });

    expect(el).to.equal(lastChild);
  });

  it('should return null if past the end', () => {
    let el;

    patch(container, () => {
      elementVoid('div');
      elementVoid('span');
      el = currentPointer();
    });

    expect(el).to.equal(null);
  });

  it('should throw an error if not patching', () => {
    expect(currentPointer).to.throw('Cannot call currentPointer() unless in patch');
  });

  it('should throw an error if inside virtual attributes element', () => {
    expect(() => {
      patch(container, () => {
        elementOpenStart('div');
        currentPointer();
        elementOpenEnd('div');
        elementClose('div');
      });
    }).to.throw('currentPointer() can not be called between elementOpenStart() and elementOpenEnd().');
  });
});
