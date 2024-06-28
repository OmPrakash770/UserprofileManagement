import { ProductDetail } from "src/product/entities/product-detail.entity";
import { ProductLogs } from "src/product/entities/product-log.entity";
import { Product } from "src/product/entities/product.entity";
import { UserDetail } from "src/user/entities/user-detail.entity";
import { UserLogs } from "src/user/entities/user-log.entity";
import { User } from "src/user/entities/user.entity";
// import { ProfileLog } from "src/userprofile/entities/profilelog.entity";
 import { ProfileLog } from "../../userprofile/entities/profilelog.entity";
import { UserProfile } from "src/userprofile/entities/userprofile.entity";
import { Users } from "src/userprofile/entities/users.entity";



export const entities = [
    User,
    UserDetail,
    UserLogs,
    Product,
    ProductDetail,
    ProductLogs,
    Users,
    UserProfile,
    ProfileLog


    
]