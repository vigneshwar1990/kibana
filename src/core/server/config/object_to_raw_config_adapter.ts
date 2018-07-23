/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { get, has, set } from 'lodash';

import { ConfigPath } from './config_service';
import { RawConfig } from './raw_config';

/**
 * Allows plain javascript object to behave like `RawConfig` instance.
 * @internal
 */
export class ObjectToRawConfigAdapter implements RawConfig {
  constructor(private readonly rawValue: { [key: string]: any }) {}

  public has(configPath: ConfigPath) {
    return has(this.rawValue, configPath);
  }

  public get(configPath: ConfigPath) {
    return get(this.rawValue, configPath);
  }

  public set(configPath: ConfigPath, value: any) {
    set(this.rawValue, configPath, value);
  }

  public getFlattenedPaths() {
    return [...flattenObjectKeys(this.rawValue)];
  }
}

function* flattenObjectKeys(
  obj: { [key: string]: any },
  path: string = ''
): IterableIterator<string> {
  if (typeof obj !== 'object' || obj === null) {
    yield path;
  } else {
    for (const [key, value] of Object.entries(obj)) {
      const newPath = path !== '' ? `${path}.${key}` : key;
      yield* flattenObjectKeys(value, newPath);
    }
  }
}
