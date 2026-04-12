// CSC-CorePlatform — Access Control Utilities
import { isControlHubRole } from '../constants/roles';
import type { CSCRole } from '../types';

/**
 * Asserts that a user role is permitted to access the Control Hub.
 * Throws if the role is missing or not an APC staff role.
 */
export function assertControlHubAccess(role: string | undefined): asserts role is CSCRole {
  if (!role || !isControlHubRole(role)) {
    throw new Error(
      `[control-hub] Access denied. Role "${role ?? 'undefined'}" is not an APC staff role.`
    );
  }
}
