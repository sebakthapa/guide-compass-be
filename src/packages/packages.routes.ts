import { Router } from 'express';
import * as cont from './packages.controllers';
import * as schemas from './packages.schemas';
import * as validators from './packages.validators';
import { authorizeUser, verifyToken } from '../middlewares/verifyToken';
import { validateData } from '../middlewares/validateData';
import { uploadFile } from '../middlewares/uploadFile';
import { validateLocation } from '../middlewares/validateLocation';

const router = Router();

router.post(
  '/',
  verifyToken,
  authorizeUser,
  uploadFile('image', false),
  validateData(schemas.PACKAGE_CREATE_SCHEMA),
  validators.validateCreatePackage,
  validateLocation('body.location'),
  cont.packagesContCreatePackage
);

router.get(
  '/guide/:guideId',
  validateData(schemas.GUIDE_PACKAGES_FETCH_SCHEMA, 'params'),
  validators.validatePackagesFetch,
  cont.packagesContFetchGuidePackages
);

router.patch(
  '/:packageId',
  verifyToken,
  authorizeUser,
  uploadFile('image', false),
  validateData(schemas.PACKAGE_UPDATE_SCHEMA),
  validateData(schemas.PACKAGE_UPDATE_PARAMS_SCHEMA, 'params'),
  validators.validateUpdatePackage,
  cont.packagesContEditGuidePackage
);
router.delete(
  '/:packageId',
  verifyToken,
  authorizeUser,
  validateData(schemas.PACKAGE_DELETE_PARAMS_SCHEMA, 'params'),
  validators.validatePackageDelete,
  cont.packagesContDeleteGuidePackage
);

export default router;
