import {Role} from "@prisma/client";

export const providerRoles = [Role.PROVIDER] as const;
export const adminRoles = [Role.VERIFICATION_ADMIN, Role.SUPER_ADMIN, Role.ADMIN] as const;

export function hasRole(currentRole: Role, allowedRoles: readonly Role[]) {
  return allowedRoles.includes(currentRole);
}

export function canManageVerification(currentRole: Role) {
  return hasRole(currentRole, adminRoles);
}
