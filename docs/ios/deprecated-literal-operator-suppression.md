# iOS 编译警告：`deprecated-literal-operator` 抑制方案（方案二）

> **适用项目**：`my_rn_project`（React Native 0.72.5 / iOS）  
> **约束**：**不修改** `node_modules`、`Pods/` 等任何三方库源码  
> **策略**：在 `ios/Podfile` 的 `post_install` 钩子中，通过 Xcode 编译选项压制该警告  
> **文档版本**：2026-07-04

---

## 1. 问题现象

在 Xcode 中 Build / Run iOS 工程时，编译日志出现如下信息（措辞可能略有差异）：

```
warning: identifier '_pt' preceded by whitespace in a literal operator declaration is deprecated
       [-Wdeprecated-literal-operator]
```

常见伴随信息：

- 文件路径指向 `YGValue.h`（Yoga 布局库）
- 出现在 **Compile** 阶段，而非 App 启动后的运行时
- 若工程开启 **Treat Warnings as Errors**（`-Werror`），该警告会导致 **Build Failed**

### 1.1 这不是什么

| 类型 | 说明 |
|------|------|
| ❌ JS 运行时错误 | 与 Metro、React 组件无关 |
| ❌ 业务代码 bug | `src/` 下 TS/TSX 不会触发 |
| ❌ 必须改 Yoga 源码 | 可通过编译选项规避，无需动三方库 |

### 1.2 这是什么

| 类型 | 说明 |
|------|------|
| ✅ C++ 编译器警告 | Apple Clang（Xcode 16+）在编译 Pod 原生代码时产生 |
| ✅ 三方库语法过时 | RN 0.72 自带的 Yoga 等库使用旧版 UDL 写法 |
| ✅ 可安全压制 | 不影响布局计算与 App 运行时行为 |

---

## 2. 根因分析

### 2.1 直接触发文件

iOS 侧 Yoga Pod 来自：

```
node_modules/react-native/ReactCommon/yoga
```

经 `pod install` 链接为 `ios/Pods` 中的 **Yoga** target。其核心头文件 `yoga/YGValue.h` 定义了用户自定义字面量（UDL）：

```cpp
// RN 0.72 中 Yoga 的旧写法（引号与后缀之间有空格）
inline YGValue operator"" _pt(long double value);
inline YGValue operator"" _percent(long double value);
```

其中 `_pt` 表示 Yoga 的 **Point（点）** 单位，`_percent` 表示百分比单位。

### 2.2 为何新版 Xcode 才报

| 层面 | 说明 |
|------|------|
| C++ 标准 | C++20 起，`operator "" identifier`（带空格）形式被标记为 **deprecated**（[CWG Issue 2521](https://cplusplus.github.io/CWG/issues/2521.html)） |
| 编译器 | Apple Clang 18+（Xcode 16+）默认启用 `-Wdeprecated-literal-operator` |
| 项目栈 | 本项目 RN **0.72.5** 发布时尚未适配该规则，Yoga 仍保留旧语法 |
| 编译时机 | 点击 Run 时 Xcode 先编译 Pods（含 Yoga），警告在此阶段输出 |

### 2.3 依赖链（iOS）

```
MyRnProject (App Target)
└── React-Core / React-Fabric 等 RN Pods
    └── Yoga 1.14.0
        └── YGValue.h  ← 警告来源（operator"" _pt）
```

`ios/Podfile.lock` 中可确认：

```ruby
Yoga (from `../node_modules/react-native/ReactCommon/yoga`)
```

### 2.4 同类风险的其它 Pod（了解即可）

除 Yoga 外，部分 RN 依赖的 C++ 库也可能含类似旧语法，例如：

| Pod | 示例后缀 | 说明 |
|-----|----------|------|
| `Yoga` | `_pt`, `_percent` | 本次 `_pt` 警告的直接来源 |
| `RCT-Folly` | `_fs`, `_sp` | Flipper / RN 基础库 |
| `fmt` | `_a`, `_format` | 字符串格式化库 |
| `boost` | `_c`, `_s` 等 | Flipper 间接依赖 |

因此方案二在「仅压制 Yoga」与「压制全部 Pod」之间存在取舍，见 [第 4 节](#4-实施方案podfile-编译选项)。

---

## 3. 方案选型：为何采用方案二

本项目约束：**不能修改三方库内容**（包括 `node_modules`、`Pods/` 内文件、`.har` 包内源码）。

| 方案 | 做法 | 是否符合约束 |
|------|------|--------------|
| 方案一 | 直接 patch `YGValue.h` 等头文件 | ❌ 修改三方库 |
| **方案二** | **Podfile `post_install` 添加 `-Wno-deprecated-literal-operator`** | **✅ 仅改工程配置** |
| 方案三 | 升级 RN / Yoga 大版本 | ⚠️ 与 RNOH 0.72.140 版本矩阵冲突，成本高 |
| 方案四 | 忽略警告 | ⚠️ 若 `-Werror` 开启则无法构建 |

**方案二本质**：告诉编译器「已知三方库使用旧语法，不要对此发出 deprecated 警告」，属于工程级 workaround，与 RN 社区处理 Xcode 版本兼容问题的惯用方式一致（例如现有的 `__apply_Xcode_12_5_M1_post_install_workaround`）。

---

## 4. 实施方案（Podfile 编译选项）

### 4.1 修改文件

仅修改：

```
ios/Podfile
```

在现有 `post_install` 块内、`react_native_post_install` **之后**追加编译选项逻辑。

### 4.2 推荐实现（全 Pod 压制）

适用于：希望一次性消除 Yoga / Folly / fmt 等所有同类警告，避免后续 Xcode 升级再次暴露。

在 `ios/Podfile` 的 `post_install do |installer|` 中，于 `react_native_post_install(...)` 和 `__apply_Xcode_12_5_M1_post_install_workaround(installer)` **之后**添加：

```ruby
  # 压制 C++20 deprecated UDL 警告（Yoga/Folly/fmt 等三方库旧语法）
  # 详见 docs/ios/deprecated-literal-operator-suppression.md
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |config|
      # C++ 源文件使用的警告开关
      cxx_flags = config.build_settings['OTHER_CPLUSPLUSFLAGS']
      cxx_flags = ['$(inherited)'] if cxx_flags.nil?
      cxx_flags = [cxx_flags] if cxx_flags.is_a?(String)
      unless cxx_flags.include?('-Wno-deprecated-literal-operator')
        cxx_flags << '-Wno-deprecated-literal-operator'
      end
      config.build_settings['OTHER_CPLUSPLUSFLAGS'] = cxx_flags

      # 部分 Pod 以 C 编译器标志传递，一并设置更稳妥
      warn_flags = config.build_settings['WARNING_CFLAGS']
      warn_flags = ['$(inherited)'] if warn_flags.nil?
      warn_flags = [warn_flags] if warn_flags.is_a?(String)
      unless warn_flags.include?('-Wno-deprecated-literal-operator')
        warn_flags << '-Wno-deprecated-literal-operator'
      end
      config.build_settings['WARNING_CFLAGS'] = warn_flags
    end
  end
```

#### 完整 `post_install` 结构示意

```ruby
  post_install do |installer|
    react_native_post_install(
      installer,
      config[:reactNativePath],
      :mac_catalyst_enabled => false
    )
    __apply_Xcode_12_5_M1_post_install_workaround(installer)

    # ↓ 在此处追加方案二代码块
    installer.pods_project.targets.each do |target|
      # ...
    end
  end
```

> **顺序说明**：必须放在 `react_native_post_install` 之后，否则 RN 官方 post_install 可能覆盖你写入的 `build_settings`。

### 4.3 精简实现（仅压制 Yoga target）

适用于：希望影响面最小，只处理已确认的 `YGValue.h` 警告。

```ruby
  deprecated_literal_operator_flag = '-Wno-deprecated-literal-operator'
  yoga_targets = %w[Yoga YogaKit]

  installer.pods_project.targets.each do |target|
    next unless yoga_targets.include?(target.name)

    target.build_configurations.each do |config|
      cxx_flags = config.build_settings['OTHER_CPLUSPLUSFLAGS'] || ['$(inherited)']
      cxx_flags = [cxx_flags] if cxx_flags.is_a?(String)
      cxx_flags << deprecated_literal_operator_flag unless cxx_flags.include?(deprecated_literal_operator_flag)
      config.build_settings['OTHER_CPLUSPLUSFLAGS'] = cxx_flags
    end
  end
```

| 对比项 | 全 Pod 压制（4.2） | 仅 Yoga（4.3） |
|--------|-------------------|----------------|
| 改动范围 | 所有 Pod targets | 仅 `Yoga` / `YogaKit` |
| 能否覆盖 Folly/fmt 同类警告 | ✅ | ❌ |
| 对编译选项的侵入性 | 略大 | 最小 |
| 推荐场景 | Xcode 16+ 日常开发 | 仅关心 `_pt` 且日志无其它 UDL 警告 |

**本项目建议**：优先采用 **4.2 全 Pod 压制**，与「不动三方库、一次性解决编译噪音」的目标更一致。

### 4.4 关键编译标志说明

| 标志 | 含义 |
|------|------|
| `-Wdeprecated-literal-operator` | Clang **开启**检测：`operator"" _suffix` 旧写法 |
| `-Wno-deprecated-literal-operator` | Clang **关闭**该检测（本方案使用） |
| `OTHER_CPLUSPLUSFLAGS` | 作用于 `.cpp` / `.mm` 等 C++ 编译单元 |
| `WARNING_CFLAGS` | 作用于 C/C++ 通用警告（部分 Pod 通过此字段传参） |
| `$(inherited)` | 保留 Xcode / Pods 既有标志，避免覆盖 RN 默认配置 |

---

## 5. 操作步骤（实施与验证）

### 5.1 实施步骤

```bash
# 1. 编辑 ios/Podfile，按第 4 节追加 post_install 代码

# 2. 重新生成 Pods 工程（在项目根目录执行）
npm run pod:install
# 或
cd ios && pod install

# 3. 打开 Workspace（必须用 .xcworkspace）
open ios/MyRnProject.xcworkspace
```

在 Xcode 中：

1. **Product → Clean Build Folder**（⇧⌘K）
2. 选择模拟器或真机
3. **Product → Run**（⌘R）

### 5.2 验证通过标准

| 检查项 | 期望结果 |
|--------|----------|
| Build 结果 | **Build Succeeded** |
| 日志中 `_pt` / `deprecated-literal-operator` | 不再出现 |
| App 启动 | 正常进入主界面 |
| 布局 | Flex 布局无异常（Yoga 逻辑未被改变，仅压制警告） |

### 5.3 验证编译标志已生效（可选）

在 Xcode 中：

1. 打开 `Pods` 工程 → 选中 `Yoga` target → **Build Settings**
2. 搜索 `OTHER_CPLUSPLUSFLAGS`
3. 确认 Debug / Release 配置中包含 `-Wno-deprecated-literal-operator`

或使用命令行：

```bash
xcodebuild -workspace ios/MyRnProject.xcworkspace \
  -scheme MyRnProject \
  -showBuildSettings 2>/dev/null \
  | grep -i "deprecated-literal"
```

---

## 6. 副作用与风险评估

### 6.1 影响范围

- **仅影响编译期**：不改变任何三方库二进制行为
- **压制范围**：所有通过该 Pod target 编译的 C++ 代码，若自身写了同类旧 UDL，也不会再警告
- **不传递至 App Target**：上述配置写在 `installer.pods_project` 上，主工程 `MyRnProject` 不受影响（通常无需配置）

### 6.2 潜在风险

| 风险 | 等级 | 说明 |
|------|------|------|
| 掩盖自有 C++ 代码中的同类问题 | 低 | 本项目几乎无自研 C++，主要为 RN 桥接 |
| `pod install` 后配置丢失 | 低 | 写在 `Podfile` 的 `post_install` 中，每次 install 自动重新应用 |
| RN 升级后不再需要 | 低 | 未来 RN 内置修复后可移除此段；属于可逆配置 |
| 与 RN 官方 post_install 冲突 | 低 | 放在 `react_native_post_install` 之后即可 |

### 6.3 与「修改三方库」方案的对比

| 维度 | 方案二（本文） | patch 三方库 |
|------|----------------|--------------|
| 合规性 | ✅ 不动三方库 | ❌ 违反约束 |
| `npm install` 后 | ✅ Podfile 仍生效 | ❌ patch 可能被覆盖 |
| 维护成本 | 低（一段 Ruby） | 中（需 postinstall 脚本 + 多路径） |
| 精确度 | 压制警告 | 从语法层面修复 |

---

## 7. 回滚方法

若需撤销方案二：

1. 删除 `ios/Podfile` 中追加的 `installer.pods_project.targets.each` 代码块
2. 执行：

```bash
cd ios && pod install
```

3. Xcode **Clean Build Folder** 后重新构建

回滚后，在 Xcode 16+ 上警告可能重新出现，但功能不受影响（在无 `-Werror` 时）。

---

## 8. 常见问题（FAQ）

### Q1：为什么不在 `MyRnProject` 主 Target 里加这个标志？

警告产生于 **Pods 工程**编译 Yoga 等库的过程中，而非主 App target。修改 `installer.pods_project` 即可；除非你在主工程自行 `#include` 了 Yoga 头文件（RN 模板默认不会）。

### Q2：压制警告会影响 Yoga 布局结果吗？

不会。`-Wno-deprecated-literal-operator` 仅关闭编译器诊断，不改变 `operator""_pt` 的语义与代码生成结果。

### Q3：`pod install` 和 `npm install` 分别做什么？

| 命令 | 与本文关系 |
|------|------------|
| `npm install` | 安装 JS 依赖，**不**应用 Podfile 中的 `post_install` 编译选项 |
| `pod install` | 读取 `Podfile`，执行 `post_install`，**必须**在修改 Podfile 后执行 |

### Q4：Harmony 端是否也用同一方案？

**否。** Harmony 使用 hvigor/CMake 构建链，需在 `harmony/entry/src/main/cpp/CMakeLists.txt` 或 RNOH CMake 中设置等效的 `-Wno-deprecated-literal-operator`。iOS 与 Harmony 方案相互独立，本文仅覆盖 **iOS**。

### Q5：升级 Xcode 后仍报错怎么办？

1. 确认 `pod install` 已重新执行  
2. 确认 `post_install` 代码在 `react_native_post_install` **之后**  
3. 检查是否启用了 `GCC_TREAT_WARNINGS_AS_ERRORS = YES`，若是，方案二仍应生效；若失败可检查是否有 **主工程** 层面的 `-Werror` 覆盖了 Pod 设置  
4. 查看完整日志，确认警告是否来自新的三方库（必要时扩大 4.2 的覆盖范围）

### Q6：能否用 `inhibit_all_warnings!` 代替？

`Podfile` 顶层的 `inhibit_all_warnings!` 会抑制 **所有** Pod 的 **所有** 警告，范围过大，不利于发现真正的编译问题。**不推荐**作为本问题的首选方案。

---

## 9. 相关文件索引

| 文件 | 作用 |
|------|------|
| `ios/Podfile` | **唯一需要修改**的工程文件（方案二） |
| `ios/Podfile.lock` | 锁定 Pod 版本；修改 Podfile 后由 `pod install` 更新 |
| `ios/MyRnProject.xcworkspace` | 必须用此文件打开工程 |
| `node_modules/react-native/ReactCommon/yoga/yoga/YGValue.h` | 警告来源（**只读，不修改**） |
| `node_modules/react-native/scripts/react_native_pods.rb` | RN 官方 `post_install` 逻辑参考 |

---

## 10. 变更记录

| 日期 | 说明 |
|------|------|
| 2026-07-04 | 初版：方案二 Podfile 抑制 `deprecated-literal-operator` 完整说明 |

---

## 11. 快速检查清单

实施前：

- [ ] 确认约束：不修改 `node_modules` / `Pods/` 内三方库文件
- [ ] 确认使用 `MyRnProject.xcworkspace` 打开工程
- [ ] 确认 Xcode 版本（建议记录，如 Xcode 16.x）

实施后：

- [ ] `ios/Podfile` 已追加 `post_install` 代码块
- [ ] 已执行 `pod install`
- [ ] Xcode Clean Build 后 Build Succeeded
- [ ] 日志中无 `deprecated-literal-operator` / `_pt` 警告
- [ ] App 可正常 Run
